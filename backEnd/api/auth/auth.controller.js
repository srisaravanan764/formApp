"use strict";

var config = require("../../config/environment");
var MSG = require("../../config/message");
var sendRsp = require("../../utils/response").sendRsp;
var log = require("../../libs/log")(module);
var request = require("request");
var _ = require("lodash");
var crypto = require("../../auth/encrypt-decrypt");
var jwtDecode = require("jwt-decode");
const userModel = require("../customer/users.model");
const util = require("util");

//Check for valid username & password and generate otp if valid.
const getRole = (docCondition) =>{
  return new Promise((resolve,reject) =>{
    let data = userModel.findOne(docCondition,{_id:0,role:1}).exec();
    data.then(data =>{
      resolve(data)
    }).catch(err =>{
      reject(err)
    })
  })
}
exports.login = async (req, res) => {
  req.checkBody("username", "MissingQueryParams").notEmpty();
  req.checkBody("password", "MissingQueryParams").notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    log.error(MSG.GLOBAL_VALUES.missingParamsMsg);
    sendRsp(res, 400, MSG.GLOBAL_VALUES.missingParamsMsg, util.inspect(errors));
    return;
  }
  try {
    const params = req.body;
    console.log(params)
    const clientId = config.auth.clientId;
    const clientSecret = config.auth.clientSecret;
    params.grant_type = "password";
    const authCode = new Buffer(clientId + ":" + clientSecret).toString(
      "base64"
    );
    let docCondition = { username: { $regex:req.body.username.toLowerCase(), $options: "i" } };
    let getRoleData = await getRole(docCondition);
    try {
      request.post(
        {
          url: config.auth.saUrl,
          form: params,
          headers: {
            Authorization: "Basic " + authCode
          }
        },
        async (err, response, body) => {
          if (err) {
            log.error(err.message, res.statusCode, err.message);
            return sendRsp(res, 500, MSG.USER_AUTH.errorMsg);
          }

          if (response.statusCode == 403 || response.statusCode == 401) {
            sendRsp(res, 203, {
              statusCode : 401, msg :  MSG.USER_AUTH.InvalidErrorMsg
            });
            return;
          }
          try {
            const rspTokens = new Object();
            const tokenJSON = JSON.parse(body);
            const refreshToken = tokenJSON.refresh_token;
            rspTokens["access_token"] = tokenJSON.access_token;
            rspTokens["expires_in"] = tokenJSON.expires_in;
            rspTokens["token_type"] = tokenJSON.token_type;
            const encryptedRefToken = crypto.encrypt(refreshToken);
            const customer_details = jwtDecode(rspTokens.access_token);
            console.log("customer_details",customer_details)
            rspTokens["username"] = customer_details.email;
            rspTokens["id"] = customer_details.userId;
            rspTokens["role"] = getRoleData.role;
            rspTokens["refreshToken"] = encryptedRefToken;
            res.cookie("admin_refresh_token", encryptedRefToken);
            log.info("200", MSG.USER_AUTH.successMsg);
            return sendRsp(res, 200, MSG.USER_AUTH.successMsg, rspTokens);
          } catch (err) {
            console.log("response final  err", err);
            log.info("400", MSG.USER_AUTH.errorMsg);
            return sendRsp("400", MSG.USER_AUTH.errorMsg);
          }
        }
      );
    } catch (err) {
      console.log("response final  err", err);
      log.info("400", MSG.USER_AUTH.errorMsg);
      return sendRsp("400", MSG.USER_AUTH.errorMsg);
    }
  } catch (err) {
    console.log("response final  err", err);
    log.info("400", MSG.USER_AUTH.errorMsg);
    return sendRsp("400", MSG.USER_AUTH.errorMsg);
  }
};

exports.refreshToken = (req, res) => {
  if (!req.body.admin_refresh_token) {
    log.error(MSG.USER_AUTH.refreshTokenMissing);
    sendRsp(res, 403, MSG.USER_AUTH.refreshTokenMissing);
    return;
  }

  var decryptedRefToken = crypto.decrypt(req.body.admin_refresh_token);

  userModel.find(
    {
      email: req.body.username
    },
    function(err, user) {
      if (err) {
        log.error(
          MSG.USER_AUTH.errorMsgGetSingular,
          res.statusCode,
          err.message
        );
        return sendRsp(res, 500, MSG.USER_AUTH.errorMsgGetSingular);
      }

      if (user.length > 0) {
        var tokens = user[0].tokens;
        var flag = false;
        for (var i = 0; i < tokens.length; i++) {
          if (tokens[i].refreshToken === decryptedRefToken) {
            flag = true;
          }
        }
        if (!flag) {
          log.error(MSG.USER_AUTH.refreshTokenMismatchError);
          sendRsp(res, 403, MSG.USER_AUTH.refreshTokenMismatchError);
          return;
        }
        var params = {};
        params.refresh_token = decryptedRefToken;
        var clientId = config.auth.clientId;
        var clientSecret = config.auth.clientSecret;
        params.grant_type = "refresh_token";

        var authCode = new Buffer(clientId + ":" + clientSecret).toString(
          "base64"
        );

        request.post(
          {
            url: config.auth.saUrl,
            form: params,
            headers: {
              Authorization: "Basic " + authCode
            }
          },
          function(err, response, body) {
            if (err) {
              log.error(MSG.USER_AUTH.errorMsg, res.statusCode, err.message);
              return sendRsp(res, 500, MSG.USER_AUTH.errorMsg);
            }

            if (!err) {
              log.info("200", MSG.USER_AUTH.successMsg);
              return sendRsp(
                res,
                200,
                MSG.USER_AUTH.successMsg,
                JSON.parse(body)
              );
            }
          }
        );
      } else {
        res.clearCookie("admin_refresh_token");
        log.error("403", MSG.USER_AUTH.notFoundMSg);
        return sendRsp(res, 403, MSG.USER_AUTH.notFoundMSg);
      }
    }
  );
};

exports.logout = (req, res) => {
  try {
    var refToken = crypto.decrypt(req.body.refreshToken);
    userModel.update(
      {
        _id: req.user._id
      },
      {
        $pull: {
          tokens: {
            refreshToken: refToken
          }
        }
      },
      (err, result) => {
        if (err) {
          log.error(MSG.USER_AUTH.errorMsg, res.statusCode, err.message);
          return sendRsp(res, 500, MSG.USER_AUTH.errorMsg);
        }
        if (!err) {
          log.info("200", MSG.USER_AUTH.logoutSuccessMsg);
          res.clearCookie("admin_refresh_token");
          return sendRsp(res, 200, MSG.USER_AUTH.logoutSuccessMsg);
        } else {
          log.error(MSG.USER_AUTH.errorMsg, res.statusCode, err.message);
          return sendRsp(res, 500, MSG.USER_AUTH.errorMsg);
        }
      }
    );
  } catch (err) {
    return sendRsp(res, 500, MSG.USER_AUTH.errorMsg + err);
  }
};

exports.createUser = (req, res) => {
  console.log("register user 1",req.body)
  req.checkBody("username", "Missing Param").notEmpty();
  req.checkBody("password", "Missing Query Param").notEmpty();
  req.checkBody("name", "Missing Query Param").notEmpty();
  req.checkBody("role", "Missing Query Param").notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    log.error("400", MSG.GLOBAL_VALUES.missingParamsMsg);
    sendRsp(res, 400, MSG.GLOBAL_VALUES.missingParamsMsg, util.inspect(errors));
    return;
  }
  console.log("register user 2",req.body)
  const customerName = req.body.name ? req.body.name : req.body.name;
  userModel.find(
    { username: req.body.username, deleted: false },
    (err, customerUser) => {
      if (err) {
        log.error("error in getting Cusotmer users", err);
        return sendRsp(res, 500, "error in getting Customer users");
      }

      if (
        customerUser.length > 0 &&
        customerUser[0].username.toString() == req.body.username
      ) {
        log.error("409", MSG.GLOBAL_VALUES.emailExistMsg);
        return sendRsp(res, 409, MSG.GLOBAL_VALUES.emailExistMsg);
      }
      var newCustomer = new userModel({
        name: customerName,
        username: req.body.username,
        role:req.body.role
      });

      if (req.body.password) {
        newCustomer.password = req.body.password;
      }
      newCustomer.save((err, newCustomerData) => {
        if (err) {
          log.error("Error in creating Customer", err);
          return sendRsp(res, 500, "Error in creating Customer");
        }

        if (!newCustomerData) {
          log.error("Error in creating Customer", err);
          return sendRsp(res, 500, "Error in creating Customer");
        } else {
          log.info("201", "Customer Created Successfully");
          return sendRsp(res, 201, "Customer Created Successfully", {
            Customer: {
              username: newCustomerData.username,
              role: newCustomerData.role,
              id: newCustomerData.id,
              name: newCustomerData.name
            }
          });
        }
      });
    }
  );
};