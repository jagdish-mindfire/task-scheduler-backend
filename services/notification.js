const NotificationRepository = require('../repository/notification')
const CONSTANT_STRINGS = require('../constants/strings.json');

exports.getAllNotifications = async ({uid}) => {
    const notifications =  await NotificationRepository.getAllNotifications({uid})
    return {notifications,statusCode:200};
};

exports.markNotificationAsRead = async ({uid,notificationId}) => {
    const response = {statusCode:200,message : CONSTANT_STRINGS.NOTIFICATION_UPDATED_SUCCESS};
    const notifications =  await NotificationRepository.markNotificationAsRead({uid,notificationId});
    if(!notifications){
        response.statusCode = 400;
        response.message = CONSTANT_STRINGS.NOTIFICATION_NOT_FOUND;
    }
    return response;
};

exports.deleteNotifications = async ({uid,notificationIds}) => {
    const response = {statusCode:200,message : CONSTANT_STRINGS.NOTIFICATION_DELETE_SUCCESS};
    const notifications =  await NotificationRepository.deleteNotifications({uid,notificationIds});
    if(!notifications){
        response.statusCode = 400;
        response.message = CONSTANT_STRINGS.NOTIFICATION_NOT_FOUND;
    }
    return response;
};