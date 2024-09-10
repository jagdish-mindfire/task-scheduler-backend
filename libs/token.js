const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");
const crypto = require("crypto");
const fs = require("fs");
const path = require('path');


const TokenModel = require('../model/token.js');
const UserModel = require("../model/auth.js");

class Token {
  constructor() {
    this.privateKey = process.env.JWT_PRIVATE_KEY;
    this.accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
    this.refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;
  }
  async accessToken({ refreshToken }) {
    const resp = { status: true };

    const validateRefreshToken = await TokenModel.findOne({refreshToken});
    const userData = await UserModel.findOne({_id:validateRefreshToken?.uid});
    if (
      validateRefreshToken &&
      new Date(validateRefreshToken?.expiryAt) >= new Date() 
    ) {
      const accessToken = jwt.sign(
        {
          uid: validateRefreshToken?.uid,
          name : userData?.name,
          session_id : sessionId
        },
        this.privateKey,
        {
          expiresIn: this.accessTokenExpiry,
        }
      );
      resp.data = accessToken;
    } else {
      resp.status = false;
      resp.error ="refresh token is expired,please login again.";
    }
    return resp;
  }
 

  /**
   *
   * @param {string} uid
   *
   * @returns {string} refreshToken/false
   */
  async createRefreshToken({ uid }) {
  
    let refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;

    const now = new Date();
    const createdAt=now;
    const expiryAt =  (now).setDate(now.getDate() + refreshTokenExpiry);

    
    const sessionId = crypto.randomBytes(16).toString('hex');
    const sessionDir = path.join(__dirname, '../config/sessions');
    const sessionFilePath = path.join(sessionDir, sessionId);
    if (!fs.existsSync(sessionDir)){
      fs.mkdirSync(sessionDir);
    }
    const fd = fs.openSync(sessionFilePath, 'w'); // Open the file
    fs.closeSync(fd); // Close the file descriptor after opening
    
    // generate new refresh token value using uuid function
    let refreshToken = randomUUID();
    await TokenModel.create({uid,refreshToken,expiryAt,sessionId});
    
    return refreshToken;
  }

  decode(accessToken) {
    try {
      const decoded = jwt.verify(accessToken, this.privateKey);
      return decoded;
    } catch (err) {
      return false;
    }
  }
 
}

module.exports = Token;
