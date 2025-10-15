/**
 * This is controller files for supporting users related APIs
 */
const objectConverter = require("../utils/objectConverter")



const User = require(("../models/user.model"))
/**
 * Controller to fetch all the users details
 */
exports.findAll = async (req, res) => {


    //Start supporting the query param
    let userTypeReq = req.query.userType;
    let userStatusReq = req.query.userStatus ;
    const queryObj = {};
    if( userTypeReq){
        queryObj.userType = userTypeReq;
    }

    if( userStatusReq){
        queryObj.userStatus = userStatusReq
    }

    console.log(queryObj);


     const users = await User.find(queryObj);
     console.log(users);
     console.log(objectConverter.userResponse(users));
     return res.status(200).send(objectConverter.userResponse(users));
}

/**
 * Controller to find the user based on the user id
 */
exports.findById = async (req, res) =>{

    const userId = req.params.userId ;

    const user = await User.find({
        userId : userId
    });

    if(user && user.length >0 ){
        return res.status(200).send(objectConverter.userResponse(user));
    }else{
        return res.status(400).send({
            message : "User with the given id not present"
        })
    }

}

/**
 * Controller to update the user and it's details
 */

exports.update = async (req, res) =>{
    const userIdReq = req.params.userId ;

    try{
        const user = await User.findOneAndUpdate({userId : userIdReq},{
            userName : req.body.userName,
            userStatus : req.body.userStatus,
            userType : req.body.userType
        }).exec();
        res.status(200).send({
            message : 'user record has been successfully updated'
        })

    }catch(err){
        console.log('Error while update the user record ', err);
        return res.status(500).send({
            message : "Some error happened internally while updating the record"
        })
    }

}