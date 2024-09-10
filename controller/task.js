const TaskModel = require('../model/task.js');

exports.getAllTasks = asyncWrapper(async (req, res) => {
    const { sort } = req.query; // Getting 'sort' from query params

    let query = TaskModel.find({ uid: req.uid });

    // Check if 'sort' param is passed, and apply sorting based on 'dueDate'
    if (sort === 'asc') {
        query = query.sort({ dueDate: 1 });  // Ascending order
    } else if (sort === 'desc') {
        query = query.sort({ dueDate: -1 }); // Descending order
    }

    const allTasks = await query;

    if (allTasks && allTasks.length > 0) {
        return res.status(200).json({
            tasks: allTasks
        });
    } else {
        return res.status(400).json({
            message: 'there are no tasks'
        });
    }
});

exports.createTask = asyncWrapper(async (req, res) => {
    let {
        title,
        description,
        due_date,
    } = req.body;

    let status = 400;
    let flag = true;
    let message = "";

    if (!title) {
        flag = false;
        message = "title cannot be empty";
    }

    if (!description) {
        flag = false;
        message = "description cannot be empty";
    }

    if (flag) {
        const createdTask = await TaskModel.create({uid:req.uid,title,description,dueDate:due_date});

            message="Task Created Successfully";
            return res.status(200).json({
                message: message,
                task_id : createdTask._id,
                task : createdTask,
            });
    } else {
        res.status(status).json({
            message: message,
        });
    }

});

exports.getOneTask = asyncWrapper(async (req, res) => {
    const {taskId} = req.params;
    const taskDetails = await TaskModel.findOne({uid:req.uid,_id:taskId});
    console.log(taskDetails);
    if(taskDetails){
        return res.status(200).json(taskDetails);
    }else{
        return res.status(400).json({
            message : 'task not found'
         });
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
    let status=400;
    if(is_completed && (is_completed !== 0 && is_completed !== 1)){
        flag=false;
        message='is completed can either be 0 or 1';
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
        message= 'No fields to update provided';
    }

    if(flag){
        const updatedTask = await TaskModel.findOneAndUpdate({_id:taskId,uid:req.uid}, {$set:updateData},  {new: true});
        
        if(updatedTask){
            message="Task Updated Successfully";
            status=200;
        }else{
            message="Task Not found";
        }
        return res.status(status).json({
            message: message,
            task:updatedTask
        });
    }else{
        res.status(400).json({
            message: message,
        });
    }

});

exports.deleteTask = asyncWrapper(async (req, res) => {

    const {taskId} = req.params;
    const taskDetails = await TaskModel.deleteOne({uid:req.uid,_id:taskId});
    if(taskDetails){
        return res.status(200).json({
           message:"task deleted successfully"
        });
    }else{
        return res.status(400).json({
            message : 'task not found'
         });
    }

});
