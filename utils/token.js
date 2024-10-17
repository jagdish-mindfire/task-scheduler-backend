const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");

const tokenModel = require('../model/token.model.js');
const userModel = require("../model/user.model.js");
const sessionHelper = require('../utils/session.js');
const constantStrings = require('../constants/strings.js');
const { APIError } = require("./custom-errors.js");
const constantErrors = require("../constants/errors.js");
class Token {
  constructor() {
    this.privateKey = process.env.JWT_PRIVATE_KEY;
    this.accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
    this.refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;
  }
  async accessToken({ refreshToken }) {
    const validateRefreshToken = await tokenModel.findOne({refreshToken});
    const userData = await userModel.findOne({_id:validateRefreshToken?.uid});
    if (
      validateRefreshToken &&
      new Date(validateRefreshToken?.expiryAt) >= new Date() 
      && await sessionHelper.checkSessionValidity(validateRefreshToken?.sessionId)
    ) {
      const accessToken = jwt.sign(
        {
          uid: validateRefreshToken?.uid,
          name : userData?.name,
          session_id : validateRefreshToken?.sessionId
        },
        this.privateKey,
        {
          expiresIn: this.accessTokenExpiry,
        }
      );
      return accessToken;
    } else {
      throw new APIError(constantErrors.INVALID_REFRESH_TOKEN);
    }
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

    const session = await sessionHelper.generateSessionId();    
    // generate new refresh token value using uuid function
    if(session.status){
      let refreshToken = randomUUID();
      await tokenModel.create({uid,refreshToken,expiryAt,sessionId:session.sessionId});
      return refreshToken;
    }
    
    return false;
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
