"use strict";

var express = require("express");
var controller = require("./users.controller");
var user = require("../../auth/customer-auth.service");

var router = express.Router();
router.get("/", controller.index);
router.get("/:id", user.isAuthenticated(), controller.show);
router.patch("/:id", user.isAuthenticated(), controller.update);
router.post("/", controller.createUser);
module.exports = router;
