"use strict";

var express = require("express");
var controller = require("./form.controller");
var router = express.Router();


router.get("/", controller.getFormdata);
router.post("/formData", controller.postFormData);

module.exports = router;