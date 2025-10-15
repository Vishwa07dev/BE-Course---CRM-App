const express = require("express");
const route = express.Router();
const ticketController = require("../controllers/ticket.controller");
const authMW = require("../middlewares/authjwt");
const verifyTicketReqBody =  require("../middlewares/verifyTicketRequestBody");


route.post("/tickets",[authMW.verifyToken, verifyTicketReqBody.validateTicketReqBody],ticketController.createTicket );
route.put("/tickets/:id", [authMW.verifyToken, verifyTicketReqBody.validateTicketStatus], ticketController.updateTicket)
route.get("/tickets",[authMW.verifyToken], ticketController.getAllTicket);
route.get("/tickets/:id",[authMW.verifyToken], ticketController.findTicketBasedOnId )
module.exports = route ;