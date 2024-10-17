const { loginSchema,signupSchema,refreshTokenSchema,logoutSchema } = require("../validation-schema/auth.schema.js");
const userService = require("../services/user.service.js");

exports.signup = asyncWrapper(async (req, res) => {
    const { email, password,name } = signupSchema.parse(req.body);
    const {message} = await userService.signup({email,name,password});
    return res.status(201).json({message});
});

exports.login = asyncWrapper(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);
    const {message,refresh_token} = await userService.login({email,password});
    return res.json({message,refresh_token});
});

exports.refreshToken = asyncWrapper(async (req, res) => {
    const { refresh_token } = refreshTokenSchema.parse(req.body);
    const {accessToken} = await userService.refreshToken({refresh_token});
    res.json({access_token:accessToken});
});

exports.logout = asyncWrapper(async (req, res) => {
    const { refresh_token,type } = logoutSchema.parse(req.body);
    const {message} = await userService.logout({refresh_token,type});
    return res.json({message});
});

