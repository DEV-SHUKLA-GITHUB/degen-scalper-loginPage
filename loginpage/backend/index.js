const express = require("express");
const app = express();
const mongoose = require("mongoose");
const brokerValidator = require("./validateBrokerCreds")
const registerRoute=require("./routes/register")
const loginRouter=require("./routes/login")
const User = require("./models/userDetails"); // Import the user schema from userDetails.js
app.use(express.json());
const shortid = require("shortid"); 
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "slkdfjlasdfkajsdlkfaksdflaksdjfoajsdofjodsf";



//connecting to database
const mongoUrl = "mongodb+srv://devshuklaji6:fU6D8Wu5BDaQlgEB@cluster0.mxffi4n.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((e) => console.log(e));



  //Routes
  app.use("/register", registerRoute)
  app.use("/login-user", loginRouter)

  app.post("/check", async (req, res) => {
    const { email, Username } = req.body;
    try {
      const emailExists = await User.exists({ email });
      const usernameExists = await User.exists({ Username });
      res.json({ emailExists, usernameExists }); // Return the response as JSON
    } catch (error) {
      res.status(500).json({ error: "Error checking email and username" }); // Return the error response as JSON
    }
  });
  
  app.post("/userData", async (req, res) => {
    const { token, BrokerList } = req.body;
    console.log(BrokerList)
if(BrokerList){
  const obj={
    broker_user_id : BrokerList.userId,
    broker_user_password : BrokerList.password,
    api_key : BrokerList.apiKey,
    api_secret : BrokerList.secretKey,
    totp_token : BrokerList.totp,
    redirect_url : "http://localhost:8000",
    broker_name: BrokerList.broker}
    brokerValidator(obj)
}

  
    try {
      // Verify the token and extract the user's email
      const user = jwt.verify(token, JWT_SECRET);
      const userEmail = user.email;
  
      // Find the user in the database using the email
      User.findOneAndUpdate(
        { email: userEmail }, // Find the user by email
        { $push: { BrokerList } }, // Push the form data to the formData array
        { new: true } // Return the updated document
      )
        .then((userData) => {
          res.json({ status: "ok", data: userData });
        })
        .catch((error) => {
          res.status(500).json({ status: "error", data: error });
        });
    } catch (error) {
      res.status(500).json({ status: "error", data: error });
    }
  });
  
  
  
  
  


// Rest of the code remains the same

app.listen(8000, () => {
  console.log("Server started on port 8000");
});

