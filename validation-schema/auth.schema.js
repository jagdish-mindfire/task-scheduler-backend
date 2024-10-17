const { z } = require('zod');
const constantStrings = require('../constants/strings');

const loginSchema = z.object({
    email: z.string({required_error:constantStrings.EMAIL_CANNOT_BE_EMPTY}).email(constantStrings.INVALID_EMAIL).transform((email) => email.toLowerCase().trim()),
    password: z.string({required_error:constantStrings.PASSWORD_CANNOT_BE_EMPTY}).min(8,{message:constantStrings.PASSWORD_MIN_LENGTH}),
});

const signupSchema = z.object({
    email: z.string({required_error : constantStrings.EMAIL_CANNOT_BE_EMPTY}).email(constantStrings.INVALID_EMAIL).transform((email) => email.toLowerCase().trim()),
    password: z.string({required_error:constantStrings.PASSWORD_CANNOT_BE_EMPTY}).min(8,{message:constantStrings.PASSWORD_MIN_LENGTH}),
    name : z.string({required_error:constantStrings.NAME_CANNOT_BE_EMPTY})
});

const refreshTokenSchema = z.object({
    refresh_token : z.string({required_error:constantStrings.REFRESH_TOKEN_REQUIRED}).min(1,{message:constantStrings.INVALID_REFRESH_TOKEN})
});

const logoutSchema = z.object({
    refresh_token: z.string(constantStrings.REFRESH_TOKEN_REQUIRED),
    type: z
        .string()
        .optional()
        .transform((type) => (type && type.toLowerCase() === 'all' ? 'all' : 'one')),
});

module.exports = {loginSchema,signupSchema,refreshTokenSchema,logoutSchema};
