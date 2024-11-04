
const userController = require("../controller/user.controller.js");
const tokenMiddleware = require("../middleware/token.js");

const express = require("express");
const router = express.Router();


router.use('/', tokenMiddleware.authMiddleware)

router.get('/me', userController.userDetails);


module.exports = router;
