const mongoose = require("mongoose");
const CONSTANT_STRINGS = require("../constants/strings.json");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, CONSTANT_STRINGS.NAME_CANNOT_BE_EMPTY],
    },
    email: {
      type: String,
      required: [true, CONSTANT_STRINGS.EMAIL_CANNOT_BE_EMPTY],
      unique: true,
    },
    password: {
      type: String,
      required: [true, CONSTANT_STRINGS.PASSWORD_CANNOT_BE_EMPTY],
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("user",UserSchema);

module.exports = UserModel;