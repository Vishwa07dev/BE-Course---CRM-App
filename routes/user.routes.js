const express = require("express");
const route = express.Router();
const userController = require("../controllers/user.controller");
const authMW = require("../middlewares/authjwt");
const verifyUserReqBody = require("../middlewares/verifyUserreqBody");

route.get("/users",[authMW.verifyToken, authMW.isAdmin],userController.findAll);

route.get("/users/:userId",[authMW.verifyToken, authMW.isAdmin],userController.findById);

route.put("/users/:userId",[authMW.verifyToken, authMW.isAdmin, verifyUserReqBody.validateUserStatusAndUserType],userController.update);


module.exports = route ;