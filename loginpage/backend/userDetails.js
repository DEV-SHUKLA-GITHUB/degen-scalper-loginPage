const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema(
  {
    FullName: String,
    email: { type: String, unique: true },
    password: String,
    Username: { type: String, unique: true },
  },
  {
    collection: "userInfo",
  }
);

module.exports = mongoose.model("User", userDetailsSchema);
