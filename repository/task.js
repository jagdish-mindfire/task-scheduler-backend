const CONSTANT_STRINGS = require("../constants/strings.json");
const TaskModel = require("../model/task")

exports.getAllTasks = async ({uid,sort}) => {
    let query = TaskModel.find({ uid});
    if (sort === 'asc') {
        query = query.sort({ dueDate: 1 });  // Ascending order
    } else if (sort === 'desc') {
        query = query.sort({ dueDate: -1 }); // Descending order
    }
    return await query;
};

exports.createTask = async ({uid,title,description,dueDate}) => {
    return await TaskModel.create({uid,title,description,dueDate}); 
};

exports.getTask = async ({uid,taskId}) => {
    return await TaskModel.findOne({uid,_id:taskId});
};

exports.deleteTask = async ({uid,taskId}) => {
    return await TaskModel.deleteOne({uid,_id:taskId}); 
};

exports.updateTask = async ({taskId,uid,dataToUpdate}) => {
    return await TaskModel.findOneAndUpdate({_id:taskId,uid}, {$set:dataToUpdate},  {new: true});
};
