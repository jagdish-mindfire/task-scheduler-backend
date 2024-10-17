const constantErrors = require('../constants/errors');
const taskService = require('../services/task.service');
const { APIError } = require('../utils/custom-errors');
const {getAllTaskSchema,createTaskSchema,updateTaskSchema,deleteTaskSchema} = require('../validation-schema/task.schema');

exports.getAllTasks = asyncWrapper(async (req, res) => {
    const {sort} = getAllTaskSchema.parse(req.params);
    const {data} = await taskService.getAllTasks({uid:req.uid,sort});
    return res.json(data);
});

exports.createTask = asyncWrapper(async (req, res) => {
    let {
        title,
        description,
        due_date,
    } = createTaskSchema.parse(req.body);

    const {message,task_id,task} = await taskService.createTask({uid:req.uid,title,description,dueDate:due_date});
    return res.json({message,task_id,task});
});

exports.getOneTask = asyncWrapper(async (req, res) => {
    const {taskId} = req.params;
    const {task} = await taskService.getTask({uid:req.uid,taskId});
    return res.json({task});  
});

exports.updateTask = asyncWrapper(async (req, res) => {
    const {taskId} = req.params;

      let {
        title,
        description,
        due_date,
        is_completed,
    } = updateTaskSchema.parse(req.body);

    let updateData = {};
    
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (due_date) updateData.dueDate = due_date;
    if (is_completed) updateData.isCompleted = is_completed;

    // If no update fields are provided.
    if (Object.keys(updateData).length === 0) {
        throw new APIError(constantErrors.NO_FIELD_TO_UPDATE);
    }

    if(updateData.dueDate){
        updateData.dueNotificationCount=0;
        updateData.overDueNotificationCount=0;
    }
    const {message,task} = await taskService.updateTask({uid:req.uid,taskId,dataToUpdate:updateData});
    return res.json({message,task});
});

exports.deleteTask = asyncWrapper(async (req, res) => {
    const {taskId} = deleteTaskSchema.parse(req.params);
    const {message} = await taskService.deleteTask({uid:req.uid,taskId});
    return res.json({message});
});
