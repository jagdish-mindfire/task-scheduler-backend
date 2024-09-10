
const authController = require("../controller/auth.js");

const express = require("express");
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/token', authController.refreshToken);

module.exports = router;
