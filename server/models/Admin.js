const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: "This field is required",
      unique: true,
    },
    password: { type: String, required: "This field is required" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", AdminSchema);
