const constantStrings = require('../constants/strings');
const notificationService = require('../services/notification.service');
const {markNotificationReadSchema,deleteNotificationSchema} = require('../validation-schema/notification.schema');

exports.getAllNotifications = asyncWrapper(async (req, res) => {
    const {notifications} = await notificationService.getAllNotifications({uid:req.uid});
    return res.json(notifications);
});

exports.markNotificationRead = asyncWrapper(async (req, res) => {
    const {notificationIds} = markNotificationReadSchema.parse(req.body);
    const {message} = await notificationService.markNotificationAsRead({uid:req.uid,notificationIds});
    return res.json({message});
});

exports.deleteNotifications = asyncWrapper(async (req, res) => {
    const {notificationIds} = deleteNotificationSchema.parse(req.body);
    const {message} = await notificationService.deleteNotifications({uid:req.uid,notificationIds})
    return res.json({message});
});

