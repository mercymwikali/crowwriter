const express = require("express");
const router= express.Router();

const authController = require("../controllers/authController");
const loginLimiter = require("../middleware/loginLimiter");

router.route("/").post(loginLimiter, authController.loginUser);

router.route("/refresh").get(authController.refreshToken);

router.route("/logout").post(authController.logoutUser);


module.exports = router