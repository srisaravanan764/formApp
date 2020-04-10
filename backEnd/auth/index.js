"use strict";

var express = require("express");
//var passport = require('passport');
var config = require("../config/environment");
var User = require("../api/customer/users.model");

var oauth = require("./oauth2");

module.exports = oauth.token;
