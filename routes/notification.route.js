
const notificationController = require("../controller/notification.controller.js");
const tokenMiddleware = require("../middleware/token.js");

const express = require("express");
const router = express.Router();


router.use('/', tokenMiddleware.authMiddleware);

router.get('/', notificationController.getAllNotifications);
router.patch('/mark-read', notificationController.markNotificationRead);
router.post('/clear', notificationController.deleteNotifications);


module.exports = router;
