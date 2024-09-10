const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date ,required: true},
    isCompleted: { type: Number, default: 0},
  },
  { timestamps: true }
);

const TaskModel = mongoose.model("task", TaskSchema);

module.exports = TaskModel;