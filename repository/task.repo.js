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

exports.createTask = async ({ uid, title, description, dueDate }) => {
  const session = await taskModel.startSession();
  session.startTransaction();

  try {
    // Shift all tasks in column 0 with boardPosition 0 down by 1
    await taskModel.updateMany(
      { uid, boardColumnId: 0, boardPosition: 0 },
      { $inc: { boardColumnId: 1 } },
      { session }
    );

    // Create the new task in column 0, position 0
    const newTask = await taskModel.create(
      { uid, title, description, dueDate, boardPosition: 0, boardColumnId: 0 },
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return newTask;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


exports.getTask = async ({uid,taskId}) => {
    return await taskModel.findOne({uid,_id:taskId});
};

exports.deleteTask = async ({uid,taskId}) => {
    return await taskModel.deleteOne({uid,_id:taskId}); 
};

exports.updateTask = async ({ taskId, uid, dataToUpdate }) => {
  const session = await taskModel.startSession();
  session.startTransaction();
  
  try {
    const { boardColumnId: newColumnId, boardPosition: newPosition } = dataToUpdate;
    
    // Retrieve current task details
    const currentTask = await taskModel.findOne({ _id: taskId, uid });
    if (!currentTask) throw new Error("Task not found");

    const currentColumnId = currentTask.boardColumnId;
    const currentPosition = currentTask.boardPosition;

    // Case 1: Moving to a different column
    if (newColumnId !== undefined && newColumnId !== currentColumnId) {
      // Shift down positions in original column
      await taskModel.updateMany(
        { uid, boardColumnId: currentColumnId, boardPosition: { $gte: currentPosition } },
        { $inc: { boardPosition: -1 } },
        { session }
      );

      // Shift up in target column
      await taskModel.updateMany(
        { uid, boardColumnId: newColumnId, boardPosition: { $gte: newPosition } },
        { $inc: { boardPosition: 1 } },
        { session }
      );

      // Update the task
      await taskModel.findOneAndUpdate(
        { _id: taskId, uid },
        { $set: { boardColumnId: newColumnId, boardPosition: newPosition } },
        { new: true, session }
      );

    } else if (newPosition !== undefined && newPosition !== currentPosition) {
      // Update within the same column
      if (newPosition > currentPosition) {
        await taskModel.updateMany(
          { uid, boardColumnId: currentColumnId, boardPosition: { $gt: currentPosition, $lte: newPosition } },
          { $inc: { boardPosition: -1 } },
          { session }
        );
      } else {
        await taskModel.updateMany(
          { uid, boardColumnId: currentColumnId, boardPosition: { $gte: newPosition, $lt: currentPosition } },
          { $inc: { boardPosition: 1 } },
          { session }
        );
      }

      // Update the task with new position
      await taskModel.findOneAndUpdate(
        { _id: taskId, uid },
        { $set: { boardPosition: newPosition } },
        { new: true, session }
      );
    }

    await session.commitTransaction();
    session.endSession();
    return await taskModel.findOne({ _id: taskId, uid });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

