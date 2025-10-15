const express = require("express");
const route = express.Router();
const authController = require("../controllers/auth.controller")
const verifyUserReqBody = require("../middlewares/verifyUserreqBody");


route.post("/auth/signup",[verifyUserReqBody.validateUserReqBody],authController.signup);
route.post("/auth/signin",authController.signin);

module.exports = route ;