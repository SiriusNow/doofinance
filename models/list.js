"use strict";
var mongoose = require("mongoose");

// const { Schema } = mongoose;
// mongoose.Promise = global.Promise;

// const listSchema = new Schema(
//     {
//         type: String,
//         income : Boolean,
//         value : Number,
//         user_id: String

//     },
// );
// create a schema
var listSchema = new mongoose.Schema({
  type: String,
  date: Date,
  category: String,
  income: Boolean,
  value: Number,
  user_id: String,
});

var List = mongoose.model("List", listSchema);

// make this available
module.exports = List;
// module.exports = mongoose.model('list',listSchema);
