const mongoose = require("mongoose");

let fullDate = new Date().toString();
let arrayDate = fullDate.split(" ");
const postDate = `${arrayDate[2]}/${arrayDate[1]}/${arrayDate[3]}`;

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: "This field is required",
  },
  description: {
    type: String,
    required: "This field is required",
  },
  image: {
    type: String,
    required: "This field is required",
  },
  visit_counter: {
    type: Number,
    default: 0,
  },
  created: {
    type: String,
    default: postDate,
  },
});

module.exports = mongoose.model("Post", postSchema);
