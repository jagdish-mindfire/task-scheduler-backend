const constantStrings = require("../constants/strings");
const userModel = require("../model/user.model");
const TaskModel = require("../model/task.model");

exports.findUser = async ({ email }) => {
  return await userModel.findOne({ email });
};

exports.createUser = async ({ email, name, password }) => {
  await userModel.create({ email, name, password });
};

exports.findUesrDetails = async ({ uid }) => {
  const user = await userModel.findById(uid, "_id name");
  const tasks = await TaskModel.find({ uid });
  // Calculate monthTaskCount
  const currentMonthStart = new Date(new Date().setDate(1));
  const monthTaskCount = {
    completed: tasks.filter(
      (task) => task.isCompleted == 1 && task.createdAt >= currentMonthStart
    ).length,
    pending: tasks.filter(
      (task) => task.isCompleted == 0 && task.createdAt >= currentMonthStart
    ).length,
  };

  // Calculate weekTaskCount
  const weekStart = new Date(new Date().setDate(new Date().getDate() - 7));
  const weekTaskCount = {
    completed: tasks.filter(
      (task) => task.isCompleted == 1 && task.createdAt >= weekStart
    ).length,
    pending: tasks.filter(
      (task) => task.isCompleted == 0 && task.createdAt >= weekStart
    ).length,
  };

  // Get 5 recent tasks
  const recentTasks = tasks
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  // Construct result
  const userWithTaskStats = {
    uid: user._id,
    name: user.name,
    monthTaskCount,
    weekTaskCount,
    recentTasks,
  };

  return userWithTaskStats;
};

// id,name,weekTaskCount,monthTaskCount,recentTasks
