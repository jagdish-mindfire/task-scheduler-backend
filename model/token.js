const mongoose = require("mongoose");

const TokenSchema = mongoose.Schema(
  {
    uid: {
    type: String,
    required: [true, "uid is required"],
    },
    refreshToken: {
      type: String,
      required: [true, "refresh token is required"],
      unique: true,
    },
    expiryAt: {
      type: Date,
      required: [true, "Password is required"],
    },
  },
  {
    timestamps: true,
  }
);

const TokenModel = mongoose.model("token",TokenSchema);

module.exports = TokenModel;