const CONSTANT_STRINGS = require('../constants/strings.json');
const TaskService = require('../services/task');

exports.getAllTasks = asyncWrapper(async (req, res) => {
    const { sort } = req.query; // Getting 'sort' from query params
    const {data,statusCode} = await TaskService.getAllTasks({uid:req.uid,sort});
    return res.status(statusCode).json(data);
    
});

exports.createTask = asyncWrapper(async (req, res) => {
    let {
        title,
        description,
        due_date,
    } = req.body;

    let statusCode = 400;
    let flag = true;
    let message = "";

    if (!title) {
        flag = false;
        message = CONSTANT_STRINGS.TITLE_CANNOT_BE_EMPTY;
    }

    if (!description) {
        flag = false;
        message = CONSTANT_STRINGS.DESCRIPTION_CANNOT_BE_EMPTY;
    }

    if (flag) {
        const {message,statusCode,task_id,task} = await TaskService.createTask({uid:req.uid,title,description,dueDate:due_date});
        return res.status(statusCode).json({message,task_id,task});
    } else {
        res.status(statusCode).json({message});
    }

});

exports.getOneTask = asyncWrapper(async (req, res) => {
    const {taskId} = req.params;
    const {isError,errorMessage,statusCode,task} = await TaskService.getTask({uid:req.uid,taskId});
    if(isError){
        return res.status(statusCode).json({
            message : errorMessage
         });
    }else{
       return res.status(statusCode).json({task});
    }
});

exports.updateTask = asyncWrapper(async (req, res) => {

    const {taskId} = req.params;
      let {
        title,
        description,
        due_date,
        is_completed,
    } = req.body;

    let flag = true;
    let statusCode=400;
    if(is_completed && (is_completed !== 0 && is_completed !== 1)){
        flag=false;
        message=CONSTANT_STRINGS.INVLAID_FORMAT_OF_IS_COMPLETE;
    }

    // Create an empty update object
    let updateData = {};

    // Dynamically add fields to updateData if they exist in req.body
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (due_date) updateData.dueDate = due_date;
    if (is_completed) updateData.isCompleted = is_completed;

    // If no update fields are provided.
    if (Object.keys(updateData).length === 0) {
        flag=false;
        message= CONSTANT_STRINGS.NO_FIELD_TO_UPDATE;
    }

    if(flag){
        if(updateData.dueDate){
            updateData.dueNotificationCount=0;
            updateData.overDueNotificationCount=0;
        }
        const {statusCode,message,task} = await TaskService.updateTask({uid:req.uid,taskId,dataToUpdate:updateData});
        
        return res.status(statusCode).json({message,task});
    }else{
        res.status(statusCode).json({message});
    }

});

exports.deleteTask = asyncWrapper(async (req, res) => {
    const {taskId} = req.params;
    const {statusCode,message} = await TaskService.deleteTask({uid:req.uid,taskId});
    return res.status(statusCode).json({message});

});
