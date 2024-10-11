const CONSTANT_STRINGS = require('../constants/strings.json');
const TaskRepository = require('../repository/task')


exports.getAllTasks = async ({uid,sort}) => {
    const response = {statusCode : 200,};
    const allTasks = await TaskRepository.getAllTasks({uid,sort});
    if(allTasks && allTasks.length === 0){
        response.statusCode = 204;
    }else{
        response.data = allTasks;
    }
    return response;
};

exports.getTask = async ({uid,taskId}) => {
    const response = {isError:false,statusCode : 200};
    const task = await TaskRepository.getTask({uid,taskId});
    if(task){
        response.task = task;
    }else{
        response.isError = true;
        response.statusCode = 400;
        response.errorMessage = CONSTANT_STRINGS.TASK_NOT_FOUND;
    }
    return response;
};
exports.createTask = async ({uid,title,description,dueDate}) => {
    const response = {statusCode : 200,message:CONSTANT_STRINGS.TASK_CREATED_SUCCESS};
    const createdTask = await TaskRepository.createTask({uid,title,description,dueDate});
    response.task_id = createdTask._id;
    response.task = createdTask;
    return response;
};

exports.updateTask = async ({taskId,uid,dataToUpdate}) => {
    const response = {statusCode : 200,message:CONSTANT_STRINGS.TASK_UPDATED_SUCCESS};
    const updatedTask = await TaskRepository.updateTask({taskId,uid,dataToUpdate});
    if(!updatedTask){
        response.statusCode = 400;
        response.message = CONSTANT_STRINGS.TASK_NOT_FOUND;
    }else{
        response.task = updatedTask;
    }
    return response;
};

exports.deleteTask = async ({uid,taskId}) => {
    const response = {statusCode : 200,message:CONSTANT_STRINGS.TASK_DELETE_SUCCESS};
    const deletedTask = await TaskRepository.deleteTask({uid,taskId});
    if(deletedTask?.deletedCount === 0){
        response.statusCode = 400;
        response.message = CONSTANT_STRINGS.TASK_NOT_FOUND;
    }
    return response;
};
