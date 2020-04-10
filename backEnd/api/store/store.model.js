const mongoose = require("mongoose");
var AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const productSchema = new Schema({
  Name:{
    type:String,
    required:false
  },
  description:{
    type:String,
    required:false
  },
  quantity:{
    type:Number,
    required:false
  },
  price:{
    type:Number,
    required:false
  },
  created_at: {
    type: Date,
    default: new Date()
  },
  updated_at: {
    type: Date,
    default: new Date()
  },
  //purchase: [{ type: Schema.Types.ObjectId, ref: 'purchase' }]
  is_deleted: {
    type: Boolean,
    default: false
  }
});

productSchema.index({});
const storyModel = mongoose.model("product", productSchema);
module.exports = storyModel;
