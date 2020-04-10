"use strict";

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var formSchema = new Schema({
data:{
  type:String,
  required :false
},
username: {
  type: String,
  required: false
},
});

module.exports = mongoose.model("form", formSchema);
