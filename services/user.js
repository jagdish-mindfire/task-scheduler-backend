const CONSTANT_STRINGS = require("../constants/strings.json");
const UserRepository = require("../repository/user");
const TokenRepository = require("../repository/token");
const passwordHelper = require('../libs/password');
const bcrypt = require('bcrypt');
const TOKEN_LIB = require("../libs/token.js");
const sessionHelper = require("../libs/session");
exports.signup = async ({email,name,password}) => {
    const response = {statusCode : 201,message:CONSTANT_STRINGS.USER_CREATED};
    const user = await UserRepository.findUser({email});
        if(user) {
            response.statusCode = 400;
            response.message=CONSTANT_STRINGS.EMAIL_ALREADY_EXISTS;
        }else{
            const encryptedPassword = passwordHelper.encryptePassword(password)
            await UserRepository.createUser({email,name,password:encryptedPassword});
        }
    return response;
};

exports.login = async ({email,password}) => {
    const response = {statusCode: 200,message:CONSTANT_STRINGS.SUCCESSFULLY_LOGGED_IN};

    const user = await UserRepository.findUser({email});
        if(user){
            if(await bcrypt.compare(password, user.password)){
                const Token = new TOKEN_LIB();
                const refreshToken = await Token.createRefreshToken({uid:user._id});

                response.refresh_token = refreshToken;
                response.name = user.name;
            }else{
                response.statusCode = 400;
                response.message=CONSTANT_STRINGS.INCORRECT_PASSWORD;
            }
        }else{
            response.statusCode = 400;
            response.message=CONSTANT_STRINGS.ACCOUNT_DOEN_NOT_EXISTS;
        }

    return response;
};


exports.refreshToken = async ({refresh_token}) => {
    const response = {statusCode : 200,isError:false};

        const token = new TOKEN_LIB();
        
        const accessToken = await token.accessToken({
            refreshToken: refresh_token,
        });
        if (accessToken.status) {
            response.access_token = accessToken.data; 
        } else {
            response.statusCode = 400; 
            response.isError = true;
            response.errorMessage = accessToken.error;
        }
        return response;
};

exports.logout = async ({refresh_token,type}) => {
    const response = {statusCode:200,isError:false};
        const tokenData = await TokenRepository.getTokenData({refreshToken:refresh_token});
        if(tokenData){
            if(type === 'one'){
                await TokenRepository.deleteTokens({refreshToken:refresh_token});
                await sessionHelper.deleteSessionId(tokenData?.sessionId);
            }else{
                const allTokens = await TokenRepository.getAllTokens({uid:tokenData?.uid});
                allTokens.map((token)=>{
                    sessionHelper.deleteSessionId(token?.sessionId)
                })
                await TokenRepository.deleteTokens({uid:tokenData.uid});
            }
            response.message = CONSTANT_STRINGS.LOGOUT_SUCCESS;
        }else{
            response.isError=true;
            response.statusCode = 400;
            response.errorMessage = CONSTANT_STRINGS.INVALID_REFRESH_TOKEN;
        }

    return response;
};