const constantErrors = require('../constants/errors');
const constantStrings = require('../constants/strings');

class APIError extends Error {
    constructor (message, statusCode=400) {
    switch (message) {
        case constantErrors.ACCOUNT_DOEN_NOT_EXISTS:
        case constantErrors.INCORRECT_PASSWORD:
        case constantErrors.EMAIL_ALREADY_EXISTS:
        case constantErrors.INVALID_REFRESH_TOKEN:
        case constantErrors.NO_TASK_FOUND:
        case constantErrors.TASK_NOT_FOUND:
        case constantErrors.NO_FIELD_TO_UPDATE:
        case constantErrors.NOTIFICATION_NOT_FOUND:
            message = constantStrings[message];
            statusCode=400;
            break; 
            
            
        case constantErrors.SESSION_EXPIRED:
        case constantErrors.UNAUTHORIZED_ACCESS:
            message = constantStrings[message];
            statusCode=401;
            break;
    
        default:
            message = constantStrings.INTERNAL_SERVER_ERROR;
            statusCode=500;
            break;
    }
    super (message)
    this.statusCode = statusCode;
    }
}

module.exports = { APIError }