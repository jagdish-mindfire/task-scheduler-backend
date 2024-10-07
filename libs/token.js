const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");

const TokenModel = require('../model/token.js');
const UserModel = require("../model/auth.js");
const sessionHelper = require('../libs/session.js');
const CONSTANT_STRINGS = require('../constants/strings.json')
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
      resp.data = accessToken;
    } else {
      resp.status = false;
      resp.error = CONSTANT_STRINGS.INVALID_REFRESH_TOKEN;
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

    const session = await sessionHelper.generateSessionId();    
    // generate new refresh token value using uuid function
    if(session.status){
      let refreshToken = randomUUID();
      await TokenModel.create({uid,refreshToken,expiryAt,sessionId:session.sessionId});
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
