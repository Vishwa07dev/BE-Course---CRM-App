/**
 * 1.Logic to starting the express server
 * 2. Make a connection to mongodb, and create a ADMIN user at the server boottime( if not already present)
 * 3. I will have to connect to the route layer 
 */
const express = require("express");
const app = express();
require('dotenv').config();
const mongoose = require("mongoose");
const User = require("./models/user.model");
const bcrypt = require("bcryptjs");

app.use(express.json());

/**
 * Make  a connection with the MongoDB
 */
(async ()=>{

    try{
           await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crm');
           console.log("Mongo Connected");
           /**
            * I need to have a default ADMIN created here from the begining
            */
           const user = await User.findOne({userId : "admin"});

           if(!user){
            console.log("Admin is not present");
            //Let's create a new ADMIN

            const admin = await User.create({
                name : "Vishwa",
                userId : "admin",
                email : "kankvishhh@gmail.com",
                userType : "ADMIN",
                password : bcrypt.hashSync("Welcome1", 8)

            });
            console.log("Admin created : ", admin)
           }else{
            console.log("Admin user is already present !");
           }


    }catch(err){
        console.log("Error : ",err);
    }

})();

/**
 * Let's stitch the auth route
 */
const auth_route = require("./routes/auth.routes");
app.use("/crm/api/v1", auth_route);

const user_route = require("./routes/user.routes");
app.use("/crm/api/v1",user_route );

const ticket_route = require("./routes/ticket.routes");
app.use("/crm/api/v1",ticket_route);



const PORT = process.env.PORT || 7777;
console.log(process.env.PORT)
app.listen(PORT , ()=>{
    console.log(`Server started running on the port num : ${PORT}`)
})