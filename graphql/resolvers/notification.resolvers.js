const asyncWrapper = require("../../middleware/async-wrapper");
const notificationService = require('../../services/notification.service');
const {markNotificationReadSchema,deleteNotificationSchema} = require('../../validation-schema/notification.schema');

exports.getAllNotifications = asyncWrapper(async (_, args, context, info) => {
    const notifications =  await notificationService.getAllNotifications({uid:context.uid})
    return notifications;
});

exports.markNotificationRead = asyncWrapper(async (_, args, context, info) => {
    const {notificationIds} = markNotificationReadSchema.parse(args);
    const {message} = await notificationService.markNotificationAsRead({uid:context.uid,notificationIds});
    return message;
});

exports.deleteNotifications = asyncWrapper(async (_, args, context, info) => {
    const {notificationIds} = deleteNotificationSchema.parse(args);
    const {message} = await notificationService.deleteNotifications({uid:context.uid,notificationIds})
   return message;
});
