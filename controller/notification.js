const NotificationModel = require('../model/notification.js');
const CONSTANT_STRINGS = require('../constants/strings.json');

exports.getAllNotifications = asyncWrapper(async (req, res) => {
    console.log(req.uid)
    let allNotifications = await NotificationModel.aggregate([
        {
            $match: { uid: req.uid } 
        },
        {
            $addFields: {
                taskIdObject: { $toObjectId: "$taskId" } // Convert taskId string to ObjectId
            }
        },
        {
            $lookup: {
                from: "tasks", 
                localField: "taskIdObject", 
                foreignField: "_id", 
                as: "taskDetails"
            }
        },
        {
            $unwind: "$taskDetails" // Flatten the array created by $lookup
        },
        {
            $addFields: {
                title: "$taskDetails.title" ,
              	dueDate : "$taskDetails.dueDate",
            }
        },
        {
            $sort: { createdAt: -1 } // Sort in descending order of createdAt
        },
        {
            $project: {
                _id: 1,
              	notificationType:1,
              	isRead:1,
              	title:1,
              	dueDate:1,
              taskId:1,
              createdAt:1,
              updatedAt:1
               
            }
        }
    ]);

    return res.status(200).json(allNotifications);
});



exports.markNotificationRead = asyncWrapper(async (req, res) => {

    const {notificationId} = req.params;

    const updatedNotification = await NotificationModel.findOneAndUpdate({_id:notificationId,uid:req.uid}, {$set:{isRead:1}},  {new: true});
    let status = 200;
    if(updatedNotification){
        message=CONSTANT_STRINGS.NOTIFICATION_UPDATED_SUCCESS;
    }else{
        message=CONSTANT_STRINGS.NOTIFICATION_NOT_FOUND;
    }
    return res.status(status).json({
        message: message,
        task:updatedNotification
    });

});

exports.deleteNotifications = asyncWrapper(async (req, res) => {

    const {notificationIds} = req.body;

        // Ensure notificationIds is an array and uid is a valid string
    if (!Array.isArray(notificationIds)) {
        return res.status(400).json({
            message: CONSTANT_STRINGS.INVALID_DATA
        });
    }

        
    const result = await NotificationModel.deleteMany({ uid: req.uid, _id: { $in: notificationIds } });

    let status = 200;
    if(result){
        message=CONSTANT_STRINGS.NOTIFICATION_DELETE_SUCCESS;
    }else{
        message=CONSTANT_STRINGS.NOTIFICATION_NOT_FOUND;
    }
    return res.status(status).json({
        message: message,
    });

});

