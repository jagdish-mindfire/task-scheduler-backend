const { ZodError } = require('zod');
const {UserInputError,AuthenticationError} = require('apollo-server');
const constantStrings = require('../constants/strings');
const {getUidFromHeader} = require('../middleware/token');

const protectedOperations = new Set([
    'getAllTasks',
    'getOneTask',
    'createTask',
    'updateTask',
    'deleteTask',
    'getAllNotifications',
    'markNotificationRead',
    'deleteNotifications',
]);


const asyncWrapper = (fn) =>{
    return async (parent,args,context,info) =>{
        try {
            const { fieldName } = info;
            if (protectedOperations.has(fieldName)) {
                // Check for the token
                const uid = await getUidFromHeader(context);
                context.uid = uid;
                if (!uid) {
                  throw new AuthenticationError(constantStrings.UNAUTHORIZED_ACCESS);
                }
              }
            return await fn(parent,args,context,info);
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((err) => err.message);
                message = errorMessages[0];  
                console.log(message);
                throw new UserInputError(message);
            }else {
                throw new Error(error);
            }
        }
    }
}

module.exports = asyncWrapper;