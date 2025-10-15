const mongoose = require("mongoose");
const constants = require("../utils/constants")

const ticketSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    ticketPriority : {
        type : Number,
        required : true,
        default : 4
    },
    description : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true,
        default : constants.ticketStatuses.open
    },
    reporter : {    // We will be used the userId
        type : String,
        required : true
    },
    assignee : {   // we will be used the userId field itself
        type : String
    }
},{timestamps : true});


module.exports =  mongoose.model("Ticket", ticketSchema);