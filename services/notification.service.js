const notificationRepository = require('../repository/notification.repo')
const constantStrings = require('../constants/strings');
const { APIError } = require('../utils/custom-errors');
const constantErrors = require('../constants/errors');

exports.getAllNotifications = async ({uid}) => {
    const notifications =  await notificationRepository.getAllNotifications({uid})
    if(!notifications || !notifications?.length){
        throw new APIError(constantErrors.NOTIFICATION_NOT_FOUND)
    }
    return notifications;
};

exports.markNotificationAsRead = async ({uid,notificationIds}) => {
    const response = {message : constantStrings.NOTIFICATION_UPDATED_SUCCESS};
    const notifications =  await notificationRepository.markNotificationAsRead({uid,notificationIds});
    if(!notifications){
        throw new APIError(constantErrors.NOTIFICATION_NOT_FOUND)
    }
    return response;
};

exports.deleteNotifications = async ({uid,notificationIds}) => {
    const response = {message : constantStrings.NOTIFICATION_DELETE_SUCCESS};
    const notifications =  await notificationRepository.deleteNotifications({uid,notificationIds});
    if(!notifications){
        throw new APIError(constantErrors.NOTIFICATION_NOT_FOUND)
    }
    return response;
};