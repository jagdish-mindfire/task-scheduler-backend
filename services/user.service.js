const constantStrings = require("../constants/strings.js");
const userRepository = require("../repository/user.repo.js");
const tokenRepository = require("../repository/token.repo.js");
const passwordHelper = require('../utils/password.js');
const bcrypt = require('bcrypt');
const TOKEN_LIB = require("../utils/token.js");
const sessionHelper = require("../utils/session.js");
const {APIError} = require("../utils/custom-errors.js");
const constantErrors = require('../constants/errors.js');

exports.signup = async ({email,name,password}) => {
    const response = {message:constantStrings.USER_CREATED};
    const user = await userRepository.findUser({email});
        if(user) {
            throw new APIError(constantErrors.EMAIL_ALREADY_EXISTS);
        }else{
            const encryptedPassword = passwordHelper.encryptePassword(password)
            await userRepository.createUser({email,name,password:encryptedPassword});
        }
    return response;
};

exports.login = async ({email,password}) => {
    const response = {message:constantStrings.SUCCESSFULLY_LOGGED_IN};

    const user = await userRepository.findUser({email});
        if(user){
            if(await bcrypt.compare(password, user.password)){
                const token = new TOKEN_LIB();
                const refreshToken = await token.createRefreshToken({uid:user._id});

                response.refresh_token = refreshToken;
                response.name = user.name;
            }else{
                throw new APIError(constantErrors.INCORRECT_PASSWORD);
            }
        }else{
            throw new APIError(constantErrors.ACCOUNT_DOEN_NOT_EXISTS);
        }

    return response;
};

exports.refreshToken = async ({refresh_token}) => {
        const token = new TOKEN_LIB();
        const accessToken = await token.accessToken({
            refreshToken: refresh_token,
        });
        return {accessToken};
};

exports.logout = async ({refresh_token,type}) => {
        const tokenData = await tokenRepository.getTokenData({refreshToken:refresh_token});
        if(tokenData){
            if(type === 'one'){
                await tokenRepository.deleteTokens({refreshToken:refresh_token});
                await sessionHelper.deleteSessionId(tokenData?.sessionId);
            }else{
                const allTokens = await tokenRepository.getAllTokens({uid:tokenData?.uid});
                allTokens.map((token)=>{
                    sessionHelper.deleteSessionId(token?.sessionId)
                })
                await tokenRepository.deleteTokens({uid:tokenData.uid});
            }
            return {message : constantStrings.LOGOUT_SUCCESS}
        }else{
            throw new APIError(constantErrors.INVALID_REFRESH_TOKEN);
        }
};