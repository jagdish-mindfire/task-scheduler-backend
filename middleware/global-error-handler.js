const {APIError} = require('../utils/custom-errors');
const { ZodError } = require('zod');
const constantStrings = require('../constants/strings');
const logger = require('../utils/logger');

const globalErrorHandler = async (err, req, res, next) => {
    let message = constantStrings.INTERNAL_SERVER_ERROR;
    let statusCode = 500;

    if(err instanceof APIError){
        message = err.message;
        statusCode = err.statusCode;
    }
    else if (err instanceof ZodError) {
        const errorMessages = err.errors.map((err) => err.message);
        message = errorMessages[0]; 
        statusCode=400;
       
    } else{
        logger.error(err);
    }

    res.status(statusCode).json({ message });
}
module.exports = globalErrorHandler;