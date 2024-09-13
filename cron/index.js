const cron = require('node-cron');
const TaskModel = require('../model/task.js');

// Schedule a cron job to run every minute
// cron.schedule('* * * * *', async () => {
//     const allTasks = await TaskModel.find({isCompleted:0});
//     // console.log(allTasks);

//   console.log('Running a task every minute');
// });
