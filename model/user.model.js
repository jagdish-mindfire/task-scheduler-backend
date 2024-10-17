const mongoose = require("mongoose");
const constantStrings = require("../constants/strings");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, constantStrings.NAME_CANNOT_BE_EMPTY],
    },
    email: {
      type: String,
      required: [true, constantStrings.EMAIL_CANNOT_BE_EMPTY],
      unique: true,
    },
    password: {
      type: String,
      required: [true, constantStrings.PASSWORD_CANNOT_BE_EMPTY],
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("user",UserSchema);

module.exports = UserModel;