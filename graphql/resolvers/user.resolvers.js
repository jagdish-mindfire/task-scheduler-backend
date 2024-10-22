const { signupSchema, loginSchema,refreshTokenSchema,logoutSchema } = require("../../validation-schema/auth.schema");
const asyncWrapper = require("../../middleware/async-wrapper");
const userService = require('../../services/user.service');



exports.signup = asyncWrapper(async (_, args, context, info) => {
    const { email, password, name } = signupSchema.parse(args);
    const {message} = await userService.signup({ email, password, name });
    return {
     message,
    };
})

exports.login = asyncWrapper(async (_, args, context, info) => {
    const {email,password} = loginSchema.parse(args);
    const {name,refreshToken, message} = await userService.login({ email, password });
    return {
      name,
      refreshToken,
      message,
    };
})

exports.refreshToken = asyncWrapper(async (_, args, context, info) => {
    const { refreshToken } = refreshTokenSchema.parse(args);
    const {accessToken} = await userService.refreshToken({refresh_token:refreshToken});
    return {accessToken};
})


exports.logout = asyncWrapper(async (_, args,context,info) =>{
    const { refreshToken,type } = logoutSchema.parse(args);
    const {message} = await userService.logout({refresh_token:refreshToken,type});
    return {message};
})
