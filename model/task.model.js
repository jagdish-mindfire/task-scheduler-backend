const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },  // optional
    dueDate: { type: Date },  // optional
    isCompleted: { type: Number, default: 0 },  // optional, with default value
    dueNotificationCount: { type: Number, default: 0 },  // optional, with default value
    overDueNotificationCount: { type: Number, default: 0 },  // optional, with default value
  },
  { timestamps: true }
);

const TaskModel = mongoose.model("task", TaskSchema);

module.exports = TaskModel;
