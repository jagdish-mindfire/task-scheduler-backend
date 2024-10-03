const mongoose = require("mongoose");
const CONSTANT_STRINGS = require("../constants/strings.json");

const TokenSchema = mongoose.Schema(
  {
    uid: {
    type: String,
    required: [true, CONSTANT_STRINGS.UID_CANNOT_BE_EMPTY],
    },
    refreshToken: {
      type: String,
      required: [true, CONSTANT_STRINGS.REFRESH_TOKEN_REQUIRED],
      unique: true,
    },
    expiryAt: {
      type: Date,
      required: [true, CONSTANT_STRINGS.PASSWORD_CANNOT_BE_EMPTY],
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