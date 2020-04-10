"use strict";

var _ = require("lodash");
var AppClient = require("./appclient.model");
var log = require("../../libs/log")(module);
var sendRsp = require("../../utils/response").sendRsp;
var MSG = require("../../config/message");
var util = require("util");

// Get list of appclients

exports.index = function(req, res) {
  AppClient.find({}, function(err, appclients) {
    if (!appclients) {
      log.error(MSG.APP_CLIENT.notFoundMsgPlural);
      sendRsp(res, 404, MSG.APP_CLIENT.notFoundMsgPlural);
      return;
    }
    if (!err) {
      log.info(MSG.APP_CLIENT.successMsgGetPlural);
      sendRsp(res, 200, MSG.APP_CLIENT.successMsgGetPlural, {
        appclients: appclients
      });
      return;
    } else {
      log.error(MSG.APP_CLIENT.errorMsgGetPlural, err);
      sendRsp(res, 500, MSG.APP_CLIENT.errorMsgGetPlural);
      return;
    }
  });
};

// Get a single appclient

exports.show = function(req, res, next) {
  var appclientId = req.params.id;
  AppClient.findById(appclientId, function(err, appclient) {
    if (!appclient) {
      log.error(MSG.APP_CLIENT.notFoundMsgSingular);
      sendRsp(res, 404, MSG.APP_CLIENT.notFoundMsgSingular);
      return;
    }
    if (!err) {
      log.info(MSG.APP_CLIENT.successMsgGetSingular);
      sendRsp(res, 200, MSG.APP_CLIENT.successMsgGetSingular, {
        appclient: appclient
      });
      return;
    } else {
      log.error(MSG.APP_CLIENT.errorMsgGetSingular, err);
      sendRsp(res, 500, MSG.APP_CLIENT.errorMsgGetSingular);
      return;
    }
  });
};

// Creates a new appclient in the DB.

exports.create = function(req, res) {
  req.checkBody("type", "Missing Query Param").notEmpty();
  req.checkBody("name", "Missing Query Param").notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    log.error(MSG.GLOBAL_VALUES.missingParamsMsg);
    sendRsp(res, 400, MSG.GLOBAL_VALUES.missingParamsMsg, util.inspect(errors));
    return;
  }

  req.body.secret = require("crypto")
    .randomBytes(32)
    .toString("base64");

  AppClient.create(req.body, function(err, appclient) {
    if (err) {
      res.statusCode = 500;
      if (err.code === 11000) {
        res.statusCode = 409;
        err.message = MSG.APP_CLIENT.conflictMsg;
      }
      log.error(MSG.APP_CLIENT.errorMsgCreate, err);
      return sendRsp(res, res.statusCode, err.message);
    }
    log.info(MSG.APP_CLIENT.successMsgCreate);
    return sendRsp(res, 201, MSG.APP_CLIENT.successMsgCreate, {
      appclient: appclient
    });
  });
};

// Updates an existing appclient in the DB.

exports.update = function(req, res) {
  req.checkBody("type", "Missing Query Param").notEmpty();
  req.checkBody("name", "Missing Query Param").notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    log.error(MSG.GLOBAL_VALUES.missingParamsMsg);
    sendRsp(res, 400, MSG.GLOBAL_VALUES.missingParamsMsg, util.inspect(errors));
    return;
  }

  if (req.body._id) {
    delete req.body._id;
  }
  AppClient.findById(req.params.id, function(err, appclient) {
    if (!appclient) {
      log.error(MSG.APP_CLIENT.notFoundMsgSingular);
      sendRsp(res, 404, MSG.APP_CLIENT.notFoundMsgSingular);
      return;
    }
    var updated = _.merge(appclient, req.body);
    updated.save(function(err) {
      if (!err) {
        log.info(MSG.APP_CLIENT.successMsgUpdate);
        sendRsp(res, 200, MSG.APP_CLIENT.successMsgUpdate, {
          appclient: appclient
        });
        return;
      } else {
        if (err.name === "ValidationError") {
          sendRsp(res, 400, MSG.APP_CLIENT.validationErrorMsg);
          return;
        } else {
          log.error(MSG.APP_CLIENT.errorMsgUpdate, err);
          sendRsp(res, 500, MSG.APP_CLIENT.errorMsgDelete);
          return;
        }
      }
    });
  });
};

// Deletes a appclient from the DB.

exports.destroy = function(req, res) {
  AppClient.findById(req.params.id, function(err, appclient) {
    if (!appclient) {
      sendRsp(res, 404, MSG.APP_CLIENT.notFoundMsgSingular);
      return;
    } else {
      appclient.remove(function(err) {
        if (!err) {
          log.info(MSG.APP_CLIENT.successMsgDelete);
          sendRsp(res, 200, MSG.APP_CLIENT.successMsgDelete, {
            appclient: appclient
          });
          return;
        } else {
          log.error(MSG.APP_CLIENT.errorMsgDelete, err);
          sendRsp(res, 500, MSG.APP_CLIENT.errorMsgDelete);
          return;
        }
      });
    }
  });
};
