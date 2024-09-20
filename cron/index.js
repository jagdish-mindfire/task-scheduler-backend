const cron = require('node-cron');
const EventEmitter = require('events');
const TaskModel = require('../model/task.js');
const NotificationModel = require('../model/notification.js');

// Create an event emitter instance
const taskEmitter = new EventEmitter();

// Function to check for incomplete tasks
async function checkDueTasks() {
    try {
        /**
         * Getting All the tasks that are required to completed in next hour.
         */
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000); 

        const incompleteTasks = await TaskModel.find({ isCompleted:0, dueDate: { $gte: now,$lte:oneHourLater } });

        const notificationsToSend = [];
        for(let i=0;i<incompleteTasks.length;i++) {
            const task = incompleteTasks[i];
            if(task.dueNotificationCount === 0){
                const insertedNotification = await NotificationModel.create({uid:task.uid,taskId:task._id,notificationType:"due"});
                await TaskModel.findOneAndUpdate({_id:task._id}, {$inc:{dueNotificationCount:1}});
                notificationsToSend.push({...insertedNotification.toObject(),title:task.title,dueDate:task.dueDate});
            }
        }
        if (notificationsToSend.length > 0) {
            // Emit an event with incomplete tasks data
            taskEmitter.emit('incompleteTasksFound', notificationsToSend);
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

async function getOverDueTaks() {
    try {
        /**
         * Getting All the tasks that exceeded the deadline.
         */
        const now = new Date();

        const incompleteTasks = await TaskModel.find({ isCompleted:0, dueDate: { $lte:now } });

        const notificationsToSend = [];
        for(let i=0;i<incompleteTasks.length;i++) {
            const task = incompleteTasks[i];
            if(task.overDueNotificationCount === 0){
                const insertedNotification = await NotificationModel.create({uid:task.uid,taskId:task._id,notificationType:"overdue"});
                await TaskModel.findOneAndUpdate({_id:task._id}, {$inc:{overDueNotificationCount:1}});
                notificationsToSend.push({...insertedNotification.toObject(),title:task.title,dueDate:task.dueDate});
            }
        }
        if (notificationsToSend.length > 0) {
            // Emit an event with incomplete tasks data
            taskEmitter.emit('incompleteTasksFound', notificationsToSend);
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// Schedule cron job to run every 5 minutes
cron.schedule('*/5 * * * *',() => {
    checkDueTasks();
    getOverDueTaks();
});

module.exports = taskEmitter;