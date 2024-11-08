const constantStrings = require("../constants/strings");
const taskModel = require("../model/task.model")

exports.getAllTasks = async ({uid,sort}) => {
    let query = taskModel.find({ uid});
    if (sort === 'asc') {
        query = query.sort({ dueDate: 1 });  // Ascending order
    } else if (sort === 'desc') {
        query = query.sort({ dueDate: -1 }); // Descending order
    }
    return await query;
};

exports.createTask = async ({uid,title,description,dueDate}) => {
    return await taskModel.create({uid,title,description,dueDate}); 
};

exports.getTask = async ({uid,taskId}) => {
    return await taskModel.findOne({uid,_id:taskId});
};

exports.deleteTask = async ({uid,taskId}) => {
    return await taskModel.deleteOne({uid,_id:taskId}); 
};

exports.updateTask = async ({taskId,uid,dataToUpdate}) => {
  return await taskModel.findOneAndUpdate({_id:taskId,uid}, {$set:dataToUpdate},  {new: true});
};

  
