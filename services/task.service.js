const constantErrors = require('../constants/errors');
const constantStrings = require('../constants/strings');
const taskRepository = require('../repository/task.repo');
const { APIError } = require('../utils/custom-errors');


exports.getAllTasks = async ({uid,sort}) => {
    const allTasks = await taskRepository.getAllTasks({uid,sort});
    if(allTasks && allTasks.length === 0){
        throw new APIError(constantErrors.NO_TASK_FOUND);
    }
    return response;
};

exports.getTask = async ({uid,taskId}) => {
    const task = await taskRepository.getTask({uid,taskId});
    if(!task){
        throw new APIError(constantErrors.TASK_NOT_FOUND);
    }
    return {task};
};

exports.createTask = async ({uid,title,description,dueDate}) => {
    const response = {message:constantStrings.TASK_CREATED_SUCCESS};
    const createdTask = await taskRepository.createTask({uid,title,description,dueDate});
    response.task_id = createdTask._id;
    response.task = createdTask;
    return response;
};

exports.updateTask = async ({taskId,uid,dataToUpdate}) => {
    const response = {message:constantStrings.TASK_UPDATED_SUCCESS};
    const updatedTask = await taskRepository.updateTask({taskId,uid,dataToUpdate});
    if(!updatedTask){
        throw new APIError(constantErrors.TASK_NOT_FOUND);
    }else{
        response.task = updatedTask;
    }
    return response;
};

exports.deleteTask = async ({uid,taskId}) => {
    const response = {message:constantStrings.TASK_DELETE_SUCCESS};
    const deletedTask = await taskRepository.deleteTask({uid,taskId});
    if(deletedTask?.deletedCount === 0){
        throw new APIError(constantErrors.TASK_NOT_FOUND);
    }
    return response;
};
