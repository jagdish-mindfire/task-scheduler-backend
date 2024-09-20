
const notificationController = require("../controller/notification.js");
const tokenMiddleware = require("../middleware/token.js");

const express = require("express");
const router = express.Router();


router.use('/', tokenMiddleware.TokenMiddleware);

router.get('/', notificationController.getAllNotifications);
router.patch('/mark-read/:notificationId', notificationController.getAllNotifications);
router.post('/clear', notificationController.deleteNotifications);


module.exports = router;
