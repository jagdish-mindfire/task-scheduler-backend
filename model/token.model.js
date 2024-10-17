const mongoose = require("mongoose");
const constantStrings = require("../constants/strings");

const TokenSchema = mongoose.Schema(
  {
    uid: {
    type: String,
    required: [true, constantStrings.UID_CANNOT_BE_EMPTY],
    },
    refreshToken: {
      type: String,
      required: [true, constantStrings.REFRESH_TOKEN_REQUIRED],
      unique: true,
    },
    expiryAt: {
      type: Date,
      required: [true, constantStrings.PASSWORD_CANNOT_BE_EMPTY],
    },
    sessionId:{
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true,
  }
);

const TokenModel = mongoose.model("token",TokenSchema);

module.exports = TokenModel;