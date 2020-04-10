const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const purchaseSchema = new Schema({
  username:{
    type:String,
    required:true
  },
  productName:{
    type:String,
    required:true
  },
  created_at: {
    type: Date,
    default: new Date()
  },
  updated_at : {
    type: Date,
    default: new Date()
  }
});

purchaseSchema.index({});
const purchaseModel = mongoose.model("purchases", purchaseSchema);
module.exports = purchaseModel;
