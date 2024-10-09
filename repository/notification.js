const NotificationModel = require('../model/notification')
const CONSTANT_STRINGS = require('../constants/strings.json');

exports.getAllNotifications = async ({uid}) => {
    return await NotificationModel.aggregate([
        {
            $match: {uid} 
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
};

exports.markNotificationAsRead = async ({notificationId,uid}) => {
    return await NotificationModel.findOneAndUpdate({_id:notificationId,uid}, {$set:{isRead:1}},  {new: true});
}

exports.deleteNotifications = async ({notificationIds,uid}) => {
    return await NotificationModel.deleteMany({ uid, _id: { $in: notificationIds } });
}