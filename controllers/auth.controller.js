const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const constants = require("../utils/constants");
const jwt = require("jsonwebtoken");
const config = require("../configs/auth.config");


/**
 * Logic to the signup - Customer ( A ) /Engineer ( P ) / Admin ( P ) 
 */

exports.signup = async (req, res)=>{

    let userStatus = req.body.userStatus ;

    if(!req.body.userType || req.body.userType == constants.userTypes.customer){
        userStatus = constants.userStatuses.approved;
    }else{
        userStatus = constants.userStatuses.pending;
    }

    //To store the user in the DB
    const userObj = {
        name : req.body.name,
        userId : req.body.userId,
        email : req.body.email,
        userType : req.body.userType,
        password : bcrypt.hashSync(req.body.password,8),
        userStatus :  userStatus
    }

    try{
        const userCreated = await User.create(userObj);
        const postRes = {
            name : userCreated.name,
            userId : userCreated.userId,
            email : userCreated.email,
            userType : userCreated.userType,
            userStatus : userCreated.userStatus,
            createdAt : userCreated.createdAt,
            udpatedAt : userCreated.updatedAt
        }
        res.status(201).send(postRes);
    }catch(err){
        console.log('Error while creating user', err);
        res.status(500).send({
            message :  "Some internal error while creating the user"
        })
    }
}

/**
 * Controller for the sign in flow
 */

exports.signin =async (req, res) => {

    /***
     * Check if the user id is present - if not return 400
     */
    const user = await User.findOne({userId : req.body.userId});

    if(user ==null){
        res.status(400).send({
            message : `User Id passed : ${req.body.userId} is not correct`
        });
        return ;
    }

    /**
     * Check if the status is approved
     */
    if(user.userStatus != constants.userStatuses.approved){
        return res.status(400).send({
            message : `Can't allow the login as the user status is not approved : Current status : ${user.userStatus}`
        })
    }

    /**
     * Check if the password matches
     */
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if(!passwordIsValid){
        return res.status(401).send({
            accessToken : null,
            message : "Invalid Password"
        });
    }

    /**
     * Generate the JWT signed token and will return that
     */
    const token = jwt.sign({id : user.userId}, config.secret, {
        expiresIn : 120
    });

    //Return the final response
    return res.status(200).send({
        name : user.name,
        userId : user.userId,
        email : user.email,
        userStatus : user.userStatus,
        accessToken : token 
    })

}