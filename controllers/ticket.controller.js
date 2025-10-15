const User = require("../models/user.model");
const constants = require("../utils/constants");
const Ticket = require("../models/ticket.model");

/**
 * Define the controller to create a new ticket.
 * 
 * As soon as a ticket is created, it should be auto assigned to an Engineer
 * if available
 */
exports.createTicket = async (req, res) =>{
    
    //Read the ticket req body
    const ticketObj  = {
        title : req.body.title,
        ticketPriority : req.body.ticketPriority,
        description : req.body.description,
        status : req.body.status,
        reporter : req.userId  // This userId will be set at the MW layer, during auth
    }

    //Create the ticket - Auto assign to the Engg if available

    //I need to find an Engineer which is in Approved state

    const engineer = await User.findOne({
        userType : constants.userTypes.engineer,
        userStatus : constants.userStatuses.approved
    })
    if(engineer){
        ticketObj.assignee = engineer.userId ;
    }

    try{
        const ticket = await Ticket.create(ticketObj);
        if(ticket){
            return res.status(201).send(ticket);
        } return
        
    }catch(err){
        console.log("Error while creating the ticket, ",err);
        return res.satus(500).send({
            message : "Some internal server error"
        })
    }
   
}

/**
 * Controller for updating the tickets
 */
exports.updateTicket =async (req, res) =>{
   const ticket = await Ticket.findOne({_id : req.params.id});

   //Which user is making the call
   const callingUserDetails = await User.findOne({
    userId : req.userId
   })

   //I want to check if the right user is trying to udpate the ticket
   /**
    * Calling user is the filer of the ticket
    * Engineer
    * Admin
    */
  console.log(ticket);

   if(ticket.reporter == req.userId || callingUserDetails.userType == constants.userTypes.engineer 
    || callingUserDetails.userType == constants.userTypes.admin
    ){
        ticket.title = req.body.title != undefined ? req.body.title : ticket.title,
        ticket.description = req.body.description != undefined ? req.body.description :ticket.description ,
        ticket.ticketPriority =  req.body.ticketPriority != undefined ? req.body.ticketPriority :ticket.ticketPriority ,  
        ticket.status = req.body.status != undefined ? req.body.status :ticket.status ,
        ticket.assignee = req.body.assignee != undefined ? req.body.assignee :ticket.assignee
        
        const updatedTicket = await ticket.save();
        return res.status(200).send(updatedTicket);

    }else{
        return res.status(400).send({
            message : "Ticket can only be updated by owner or engineer or admin"
        })
    }
}

/**
 * Fetching all the tickets :
 * 1. Customers  - he/she should fetch only his own list of tickets
 * 2. Engineer - he/she should get all the tickets assigned to them and created by them
 * 3. Admin - He/She should get all the tickets irrespective
 */

exports.getAllTicket = async (req, res) =>{

    const queryObj = {};
    /**
     * Fetch the user obj which is making the request
     */
    const savedUser = await User.findOne({
        userId : req.userId
    });
    if(savedUser.userType == constants.userTypes.customer){
        // We should only return the tickets filed by this customers
        queryObj.reporter = savedUser.userId ; 
    }else if(savedUser.userType == constants.userTypes.engineer){
        //Get the tickets assigned to an Engineer
        queryObj.assignee = savedUser.userId ;
    }else{
        //Get all the tickets
    }

    const tickets = await Ticket.find(queryObj);

    return res.status(200).send(tickets);
}

/**
 * Fetch the ticket based on the ticketId
 */

exports.findTicketBasedOnId = async (req, res)=>{

    
    const ticket = await Ticket.findOne({
        _id : req.params.id
    });

    const savedUser = await User.findOne({
        userId : req.userId
    });

    if(savedUser.userType == constants.userTypes.admin 
        || ticket.reporter == req.userId || ticket.assignee == req.userId){
        return res.status(200).send(ticket);
    }else{
        return res.status(400).send({
            message : "can't return the ticket details as you are not authorized"
        })
    }
    
}
