/**
 * Main application routes
 */
"use strict";

module.exports = function(app) {
  //Admin Routes

  const config = require("./config/environment");
  const expressJwt = require("express-jwt");
  const log = require("./libs/log")(module);

  app.use("/api/auth", require("./api/auth"));
  app.use("/api/customer/", require("./api/customer"));
  app.post("/auth/token", require("./auth"));
  app.use("/api/appclients", require("./api/appclient"));
  app.use("/api/store",require("./api/store"));
  app.use("/api/forms",require("./api/formData"));

  //index route
  app.use("/", function(req, res, next) {
    res.send('<h4 style="text-align:center">Index Route.</h4>');
  });
  app.use(
    expressJwt({
      secret: config.secrets.accessToken
    })
  );

  app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
      res.status(err.status).send({
        message:
          "Your authentication information is incorrect. Please try again.",
        api_msg: err.message,
        code: 999
      });
      log.error(err);
      return;
    }
    next();
  });
};
