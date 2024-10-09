const CONSTANT_STRINGS = require('../constants/strings.json');
const NotificationService = require('../services/notification');

exports.getAllNotifications = asyncWrapper(async (req, res) => {
    const {statusCode,notifications} = await NotificationService.getAllNotifications({uid:req.uid});
    return res.status(statusCode).json(notifications);
});

exports.markNotificationRead = asyncWrapper(async (req, res) => {
    const {notificationId} = req.params;
    const {statusCode,message} = await NotificationService.markNotificationAsRead({uid:req.uid,notificationId});
    return res.status(statusCode).json({message});

});

exports.deleteNotifications = asyncWrapper(async (req, res) => {

    const {notificationIds} = req.body;

    // Ensure notificationIds is an array and uid is a valid string
    if (!Array.isArray(notificationIds)) {
        return res.status(400).json({
            message: CONSTANT_STRINGS.INVALID_DATA
        });
    }

    const {statusCode,message} = await NotificationService.deleteNotifications({uid:req.uid,notificationIds})
    return res.status(statusCode).json({message});
});

