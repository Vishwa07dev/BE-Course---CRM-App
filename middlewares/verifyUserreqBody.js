const User = require("../models/user.model");
const constants = require("../utils/constants");

validateUserRequestBody  = async (req, res, next)=>{

    //Validate the userName
    if(!req.body.name){
        res.status(400).send({
            message : "Failed ! Bad Request, userName field is not passed or empty"
        });
        return ;
    }

    //Validate the password
    if(!req.body.password){
        res.status(400).send({
            message : "Failed ! Bad Request, password field is not passed or empty"
        });
        return ;
    }
    if(!req.body.userId){
        res.status(400).send({
            message : "Failed ! Bad Request, userId field is not passed or empty"
        });
        return ;
    }

    //Let check if the userIs is unique
    const user = await User.findOne({userId : req.body.userId});
    if(user!=null){
        res.status(400).send({
            message : "Failed ! Bad Request, userId field is already registered, Please change and try"
        });
        return ;
    }
    if(!req.body.email){
        res.status(400).send({
            message : "Failed ! Bad Request, email field is not passed or empty"
        });
        return ;
    }

    //Let check if the email Id  is unique
    const user1 = await User.findOne({email : req.body.email});
    if(user1!=null){
        res.status(400).send({
            message : "Failed ! Bad Request, email field is already registered, Please change and try"
        });
        return ;
    }

    //Validating the userType
    const possibleUserTypes  = [constants.userTypes.customer , constants.userTypes.engineer , constants.userTypes.admin]

    if(req.body.userType && !possibleUserTypes.includes(req.body.userType)){
        res.status(400).send({
            message : "UserType passed is invalid ! .. Please correct and re-try !"

        })
        return ;
    }

    next();

}

const validateUserStatusAndUserType  =  (req, res, next) => {
    // Validate user type
    const userType = req.body.userType;
    const possibleUserTypes  = [constants.userTypes.customer , constants.userTypes.engineer , constants.userTypes.admin]
    if(userType && !possibleUserTypes.includes(userType)){
        res.status(400).send({
            message : "User Type provided is invalid. Possible values CUSTOMER | ENGINEER | ADMIN"
        });
        return ;
    }
 

    // Validate user status
    const userStatus = req.body.userStatus ;
    const userStatuses = [constants.userStatuses.approved, constants.userStatuses.pending, constants.userStatuses.blocked];
    if(userStatus && ! userStatuses.includes(userStatus)){
        res.status(400).send({
            message : "User Status provided is invalid. Possible values are PENDING | APPROVED | REJECTED"
        });
        return ;
    }

    next();
}

module.exports = {
    validateUserReqBody : validateUserRequestBody,
    validateUserStatusAndUserType : validateUserStatusAndUserType
}