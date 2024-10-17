const constantErrors = require('../constants/errors');
const constantStrings = require('../constants/strings');

class APIError extends Error {
    constructor (message, statusCode=400) {
    switch (message) {
        case constantErrors.ACCOUNT_DOEN_NOT_EXISTS:
            message = constantStrings.ACCOUNT_DOEN_NOT_EXISTS;
            statusCode=400;
            break;
        
        case constantErrors.INCORRECT_PASSWORD:
            message = constantStrings.INCORRECT_PASSWORD;
            statusCode=400;
            break;

        case constantErrors.EMAIL_ALREADY_EXISTS:
            message = constantStrings.EMAIL_ALREADY_EXISTS;
            statusCode=400;
            break;

        case constantErrors.INVALID_REFRESH_TOKEN:
            message = constantStrings.INVALID_REFRESH_TOKEN;
            statusCode=400;
            break;

        case constantErrors.NO_TASK_FOUND:
            message = constantStrings.NO_TASK_FOUND;
            statusCode=400;
            break;
     
        case constantErrors.TASK_NOT_FOUND:
            message = constantStrings.TASK_NOT_FOUND;
            statusCode=400;
            break;
   
        case constantErrors.NO_FIELD_TO_UPDATE:
            message = constantStrings.NO_FIELD_TO_UPDATE;
            statusCode=400;
            break;

        case constantErrors.NOTIFICATION_NOT_FOUND:
            message = constantStrings.NOTIFICATION_NOT_FOUND;
            statusCode=400;
            break;
    
        default:
            message = constantStrings.INTERNAL_SERVER_ERROR;
            statusCode=400;
            break;
    }
    super (message)
    this.statusCode = statusCode;
    console.error(message,this.statusCode);
    }
}
const throwAPIError   = (msg, statusCode) => {
    return new APIError(msg, statusCode)
}
module.exports = { throwAPIError, APIError }