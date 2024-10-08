const CONSTANT_STRINGS = require("../constants/strings.json");
const UserService = require("../services/user.js");

exports.signup = asyncWrapper(async (req, res, next) => {
    let {
        email,
        name,
        password,
    } = req.body;

    let statusCode = 400;
    let flag = true;
    let message;

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
        const serviceResponse = await UserService.signup({email,name,password});
        statusCode = serviceResponse.statusCode;
        message = serviceResponse.message;
    }
    return res.status(statusCode).json({message});
});

exports.login = asyncWrapper(async (req, res, next) => {
    let {
        email,
        password,
    } = req.body;

    let statusCode = 400;
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
        const {statusCode,message,refresh_token,name} = await UserService.login({email,password});
        return res.status(statusCode).json({message,refresh_token,name});
    }
    return res.status(statusCode).json({message});
});

exports.refreshToken = asyncWrapper(async (req, res) => {
    const {
        refresh_token,
    } = req.body;
    let responseStatusCode=400;
    const response = {};
    if (refresh_token) {
        const {isError,errorMessage,statusCode,access_token} = await UserService.refreshToken({refresh_token});
        responseStatusCode = statusCode;
        if(!isError){
            response.access_token = access_token;
        }else{
            response.message = errorMessage;
        }
    }else{
        response.message = CONSTANT_STRINGS.REFRESH_TOKEN_REQUIRED;
    }
    res.status(responseStatusCode).json(response);
});

exports.logout = asyncWrapper(async (req, res) => {
    let responseStatusCode = 400;
    const response = {};

    let { refresh_token,type } = req.body;
    if(type && type.toLowerCase() === 'all'){
        type="all";
    }else{
        type="one";
    }

    if (refresh_token) {
        const {isError,errorMessage,message,statusCode} = await UserService.logout({refresh_token,type});
        responseStatusCode = statusCode;
        if(!isError){
            response.message = message;
        }else{
            response.message = errorMessage;
        }
    } else {
        response.message = CONSTANT_STRINGS.REFRESH_TOKEN_REQUIRED;
    }
    return res.status(responseStatusCode).json(response);
});

