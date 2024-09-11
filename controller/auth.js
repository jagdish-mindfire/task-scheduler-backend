const bcrypt = require('bcrypt');
const UserModel = require('../model/auth.js');
const TokenModel = require("../model/token.js");
const passwordHelper = require('../libs/password.js');
const sessionHelper = require('../libs/session.js');
const TOKEN_LIB = require("../libs/token.js");

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
        message = "Email cannot be empty";
    } else {
        email = email.toLowerCase().trim();
    }

    if (!name) {
        flag = false;
        message = "name cannot be empty";
    }

    if (!password) {
        flag = false;
        message = "password cannot be empty";
    }
    if (flag) {
        const user = await UserModel.findOne({ email});
        if(user) {
            message="It looks like you already have an account. Please log in to continue.";
            return res.status(status).json({
                message: message,
            });
        }else{
            const encryptedPassword = passwordHelper.encryptePassword(password)
            await UserModel.create({email,name,password:encryptedPassword});
            status = 200;
            message = "user created successfully!";
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
        message = "Email cannot be empty";
    } else {
        email = email.toLowerCase().trim();
    }
    if (!password) {
        flag = false;
        message = "password cannot be empty";
    }

    
    if (flag) {
        const user = await UserModel.findOne({email});
        if(user){
            if(await bcrypt.compare(password, user?.password)){
                const Token = new TOKEN_LIB();
                const refreshToken = await Token.createRefreshToken({uid:user._id});
                status=200;
                return res.status(status).json({
                    message:`You've successfully logged in!`,
                    refresh_token: refreshToken,
                    name:user.name,
                }); 

            }else{
                message="The password you entered is incorrect. Please try again";
            }
        }else{
            message="Account not found. Please sign up to create a new account";
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
                "Refresh token is required"
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
                await TokenModel.deleteMany({uid:userData.uid});
            }
            httpResponse.message = 'successfully logout';

        }else{
            httpStatus = 400;
            httpResponse.message = "Invalid refresh token"
        }

        
    } else {
        httpStatus = 400;
        httpResponse.message = "Refresh token required"
    }

    if (!httpResponse.message) {
        httpResponse.message = "Something went wrong."
    }
    return res.status(httpStatus).json(httpResponse);

});

