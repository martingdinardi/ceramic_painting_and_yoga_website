const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "This field is required",
    },
    email: {
      type: String,
      required: "This field is required",
    },
    phone: {
      type: String,
    },
    viewed: {
      type: Boolean,
      default: false,
    },
    course: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", ContactSchema);
