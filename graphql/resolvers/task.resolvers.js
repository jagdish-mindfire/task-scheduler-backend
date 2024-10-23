const asyncWrapper = require("../../middleware/async-wrapper");
const taskService = require('../../services/task.service');
const {getAllTaskSchema,createTaskSchema,updateTaskSchema,deleteTaskSchema} = require('../../validation-schema/task.schema');
const { APIError } = require('../../utils/custom-errors');

exports.getAllTasks = asyncWrapper(async (_, args, context, info) => {
    const {sort} = getAllTaskSchema.parse(args);
    const {data} = await taskService.getAllTasks({uid:context.uid,sort});
    return data.map(task => ({
        _id: task._id.toString(),
        title: task.title,
        description: task.description,
        isCompleted: !!task.isCompleted, 
        dueDate: task.dueDate.toISOString(), 
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      }));

})

exports.createTask = asyncWrapper(async (_, args, context, info) => {
    let {
        title,
        description,
        dueDate,
    } = createTaskSchema.parse(args);

    const {task} = await taskService.createTask({uid:context.uid,title,description,dueDate});
    return task;
})

exports.getOneTask = asyncWrapper(async (_, args, context, info) => {
    const {taskId} = args;
    const {task} = await taskService.getTask({uid:context.uid,taskId});
    return task;
})

exports.updateTask = asyncWrapper(async (_, args,context,info) =>{
    let {
      title,
      description,
      due_date,
      is_completed,
      taskId
  } = updateTaskSchema.parse(args);

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

  const {task} = await taskService.updateTask({uid:context.uid,taskId,dataToUpdate:updateData});
  return task;
})

exports.deleteTask = asyncWrapper(async (_, args, context, info)  => {
    const {taskId} = deleteTaskSchema.parse(args);
    const {message} = await taskService.deleteTask({uid:context.uid,taskId});
    return {message};
});
