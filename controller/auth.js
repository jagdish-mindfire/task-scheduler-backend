const bcrypt = require('bcrypt');
const UserModel = require('../model/auth.js');
const TokenModel = require("../model/token.js");
const passwordHelper = require('../libs/password.js');
const sessionHelper = require('../libs/session.js');
const TOKEN_LIB = require("../libs/token.js");
const CONSTANT_STRINGS = require("../constants/strings.json");

exports.signup = asyncWrapper(async (req, res, next) => {
    let {
        email,
        name,
        password,
    } = req.body;

    let status = 400;
    let flag = true;
    let message = "";

    if (!email) {
        flag = false;
        message = CONSTANT_STRINGS.EMAIL_CANNOT_BE_EMPTY;
    } else {
        email = email.toLowerCase().trim();
    }

    if (!name) {
        flag = false;
        message = CONSTANT_STRINGS.NAME_CANNOT_BE_EMPTY;
    }

    if (!password) {
        flag = false;
        message =CONSTANT_STRINGS.PASSWORD_CANNOT_BE_EMPTY;
    }
    if (flag) {
        const user = await UserModel.findOne({ email});
        if(user) {
            message=CONSTANT_STRINGS.EMAIL_ALREADY_EXIST;
            return res.status(status).json({
                message: message,
            });
        }else{
            const encryptedPassword = passwordHelper.encryptePassword(password)
            await UserModel.create({email,name,password:encryptedPassword});
            status = 201;
            message = CONSTANT_STRINGS.USER_CREATED;
            return  res.status(status).json({message});
        }
    } else {
        res.status(status).json({
            message: message,
        });
    }
});

exports.login = asyncWrapper(async (req, res, next) => {
    let {
        email,
        password,
    } = req.body;

    let status = 400;
    let flag = true;
    let message = "";

    if (!email) {
        flag = false;
        message = CONSTANT_STRINGS.EMAIL_CANNOT_BE_EMPTY;
    } else {
        email = email.toLowerCase().trim();
    }
    if (!password) {
        flag = false;
        message = CONSTANT_STRINGS.PASSWORD_CANNOT_BE_EMPTY;
    }

    
    if (flag) {
        const user = await UserModel.findOne({email});
        if(user){
            if(await bcrypt.compare(password, user?.password)){
                const Token = new TOKEN_LIB();
                const refreshToken = await Token.createRefreshToken({uid:user._id});
                status=200;
                return res.status(status).json({
                    message:CONSTANT_STRINGS.SUCCESSFULLY_LOGGED_IN,
                    refresh_token: refreshToken,
                    name:user.name,
                }); 

            }else{
                message=CONSTANT_STRINGS.INCORRECT_PASSWORD;
            }
        }else{
            message=CONSTANT_STRINGS.ACCOUNT_ALREADY_EXISTS;
        }
    }
    return res.status(status).json({
        message: message,
    });
});

exports.refreshToken = asyncWrapper(async (req, res) => {
    const {
        refresh_token,
    } = req.body;
    if (refresh_token ) {
        const token = new TOKEN_LIB();
        
        const accessToken = await token.accessToken({
            refreshToken: refresh_token,
        });
        if (accessToken.status) {
            res.json({
                access_token: accessToken.data,
            });
        } else {
            res.status(400).json({
                message: accessToken.error,
            });
        }

    }
     
     else {
        res.status(400).json({
            message: 
                CONSTANT_STRINGS.REFRESH_TOKEN_REQUIRED
        });
    }
});

exports.logout = asyncWrapper(async (req, res) => {

    let httpStatus = 200;
    let httpResponse = {};

    let { refresh_token,type } = req.body;
    if(type && type.toLowerCase() === 'all'){
        type="all";
    }else{
        type="one";
    }

    if (refresh_token) {
        const userData = await TokenModel.findOne({refreshToken:refresh_token});
        if(userData){
            if(type === 'one'){
                await TokenModel.deleteOne({refreshToken:refresh_token});
                await sessionHelper.deleteSessionId(userData?.sessionId);
            }else{
                const allTokens = await TokenModel.find({uid:userData?.uid});
                allTokens.map((token)=>{
                    sessionHelper.deleteSessionId(token?.sessionId)
                })
                await TokenModel.deleteMany({uid:userData.uid});
            }
            httpResponse.message = '';

        }else{
            httpStatus = 400;
            httpResponse.message = CONSTANT_STRINGS.INVALID_REFRESH_TOKEN;
        }

        
    } else {
        httpStatus = 400;
        httpResponse.message = CONSTANT_STRINGS.LOGOUT_SUCCESS;
    }

    if (!httpResponse.message) {
        httpResponse.message = CONSTANT_STRINGS.SOMETHING_WENT_WRONG;
    }
    return res.status(httpStatus).json(httpResponse);

});

