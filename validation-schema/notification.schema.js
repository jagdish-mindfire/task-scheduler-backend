const { z } = require('zod');
const constantStrings = require('../constants/strings');

const regexForMongoObjectId = /^[a-fA-F0-9]{24}$/;

const markNotificationReadSchema = z.object({
    notificationIds: z
        .array(
            z.string().regex(regexForMongoObjectId, { 
                message: constantStrings.INVALID_NOTIFICATION_ID,  
            })
        )
        .nonempty({ message: constantStrings.NOTIFICATION_IDS_CANNOT_BE_EMPTY }),
});

const deleteNotificationSchema = z.object({
    notificationIds: z
        .array(
            z.string().regex(regexForMongoObjectId, { 
                message: constantStrings.INVALID_NOTIFICATION_ID,  
            })
        )
        .nonempty({ message: constantStrings.NOTIFICATION_IDS_CANNOT_BE_EMPTY }),
});

module.exports = {markNotificationReadSchema,deleteNotificationSchema};
