const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    taskId:{
        type: String,
        required: true,
      },
    notificationType : {
        type:String,
        required:true
      },
      isRead : {
        type: Boolean,
        default: false,
        required: true,
      }
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model("notification", NotificationSchema);

module.exports = NotificationModel;