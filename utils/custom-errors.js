const constantErrors = require('../constants/errors');
const constantStrings = require('../constants/strings');
const {UserInputError} = require('apollo-server');

class APIError extends Error {
    constructor (message,code) {
    switch (message) {
        case constantErrors.ACCOUNT_DOEN_NOT_EXISTS:
        case constantErrors.INCORRECT_PASSWORD:
        case constantErrors.EMAIL_ALREADY_EXISTS:
        case constantErrors.INVALID_REFRESH_TOKEN:
        case constantErrors.NO_TASK_FOUND:
        case constantErrors.TASK_NOT_FOUND:
        case constantErrors.NO_FIELD_TO_UPDATE:
        case constantErrors.NOTIFICATION_NOT_FOUND:
            throw new UserInputError(constantStrings[message]);
            message = constantStrings[message];
            code=constantErrors[message];
            break; 
            
            
        case constantErrors.SESSION_EXPIRED:
        case constantErrors.UNAUTHORIZED_ACCESS:
            message = constantStrings[message];
            code=constantErrors[message];
            break;
    
        default:
            message = constantStrings.INTERNAL_SERVER_ERROR;
            code=constantErrors[message];
            break;
    }
    super (message)
    }
}

module.exports = { APIError }