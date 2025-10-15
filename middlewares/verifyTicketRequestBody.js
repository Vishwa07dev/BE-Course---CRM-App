const constants = require("../utils/constants");

const validateTicketReqBody = (req, res, next) => {
    //Validat if the title is present

    if(!req.body.title){
        return res.status(400).send({
            message : "Failed! Title is missing"
        })
    }

    if(!req.body.description){
        return res.status(400).send({
            message : "Failed! Description is missing"
        })
    }

    next();
}

const validateTicketStatus  = (req, res, next) =>{
    const status = req.body.status ;
    const statusTypes = [constants.ticketStatuses.open, constants.ticketStatuses.closed, constants.ticketStatuses.blocked];
    if(status && !statusTypes.includes(status)){
        return res.status(400).send({
            message : "Status passed is not correct !"
        })
    }

    next();
}


module.exports = {
    validateTicketReqBody : validateTicketReqBody,
    validateTicketStatus : validateTicketStatus
}