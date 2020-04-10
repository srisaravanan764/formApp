"use strict";

var mongoose = require("mongoose");
var crypto = require("crypto");
var Schema = mongoose.Schema;

// userSchema Schema
var userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    default: "4CIu3vw0tyWlDn2b" // Api ref key
  },
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  tokens: [
    {
      appClient: {
        type: String,
        required: true
      },
      refreshToken: {
        type: String,
        required: true
      },
      lastAccess: {
        type: Date,
        required: false
      }
    }
  ],
  deleted: {
    type: Boolean,
    default: false
  },

  role: {
    type: String,
    default: "User"
  }
});

userSchema.index({});

/**
 * Virtuals
 */
userSchema.virtual("password")
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    //console.log("user: ", this);
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

var validatePresenceOf = function(value) {
  return value && value.length;
};

// Validate empty username
userSchema.path("username").validate(function(username) {
  return username.length;
}, "username cannot be blank");

// Validate empty password
userSchema.path("hashedPassword").validate(function(hashedPassword) {
  console.log("Hashed pwd:", hashedPassword);
  return hashedPassword.length;
}, "Password cannot be blank");

/**
 * Methods
 */
userSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String}
   *            plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    console.log(
      this.hashedPassword,
      "customer encryptPassword",
      this.encryptPassword(plainText)
    );
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString("base64");
  },

  /**
   * Encrypt password
   *
   * @param {String}
   *            password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return "";
    var saltWithEmail = new Buffer(
      this.salt + this.username.toString("base64"),
      "base64"
    );
    return crypto
      .pbkdf2Sync(password, saltWithEmail, 10000, 64, null)
      .toString("base64");
  }
};

var userModel = mongoose.model("users", userSchema);
module.exports = userModel;
