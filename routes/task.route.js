
const taskController = require("../controller/task.controller.js");
const tokenMiddleware = require("../middleware/token.js");

const express = require("express");
const router = express.Router();


router.use('/', tokenMiddleware.authMiddleware)

router.get('/', taskController.getAllTasks);
router.post('/create', taskController.createTask);
router.get('/:taskId', taskController.getOneTask);
router.patch('/:taskId', taskController.updateTask);
router.delete('/:taskId', taskController.deleteTask);

module.exports = router;
