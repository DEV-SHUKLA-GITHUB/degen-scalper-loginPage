const express = require("express");
const app = express();
const mongoose = require("mongoose");
const brokerValidator = require("./validateBrokerCreds")
const User = require("./userDetails"); // Import the user schema from userDetails.js
app.use(express.json());
const shortid = require("shortid"); 
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "slkdfjlasdfkajsdlkfaksdflaksdjfoajsdofjodsf";

const mongoUrl = "mongodb+srv://devshuklaji6:fU6D8Wu5BDaQlgEB@cluster0.mxffi4n.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((e) => console.log(e));
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
  app.post("/login-user", async (req, res) => {
    const { email, password } = req.body;
  
    // Validate user credentials
    try {
      // Find the user by email in your database
      const user = await User.findOne({ email });
  
      // If user does not exist, send an error response
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
  
      // Compare the password provided with the hashed password stored in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      // If password is invalid, send an error response
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
  
      // Generate a JSON Web Token (JWT) for authentication
      const token = jwt.sign({ email: user.email }, JWT_SECRET);
  
      // Send the token as a response
      res.json({ status: "ok", data: token });
    } catch (error) {
      console.error("Login failed:", error);
      res.status(500).json({ error: "An error occurred during login" });
    }
  });
  // app.post("/getUserData",(req, res) => {
  //   try{
  //     const user = jwt.verify(token, JWT_SECRET);
  //     const userData=user.findOne({})
  //   }
  //   catch(e){
  //     console.log(e)
  //   }
  // }
  // )

  app.post("/checkAuth", async (req, res) => {
    const { token} = req.body;

  
    try {
      // Verify the token and extract the user's email
      const user = jwt.verify(token, JWT_SECRET);
      const userEmail = user.email;
  
      // Find the user in the database using the email
      User.findOne(
        { email: userEmail }
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
  
  app.post("/userData", async (req, res) => {
    
    var isValidated=false;
    const { token, BrokerList } = req.body;
    
  const obj={
    broker_user_id : BrokerList.userId,
    broker_user_password : BrokerList.password,
    api_key : BrokerList.apiKey,
    api_secret : BrokerList.secretKey,
    totp_token : BrokerList.totp,
    redirect_url : "http://localhost:8000",
    broker_name: BrokerList.broker}
    const response=await brokerValidator(obj)
    if(response){isValidated=true}



  
    try {
      // Verify the token and extract the user's email
      const user = jwt.verify(token, JWT_SECRET);
      const userEmail = user.email;
      // Find the user in the database using the email
      if(isValidated){
        User.findOneAndUpdate(
          { email: userEmail }, // Find the user by email
          { $push: { BrokerList } }, // Push the form data to the formData array
          { new: true } // Return the updated document
        )
          .then((userData) => {
            console.log("updated")
            res.json({ status: "ok", data: userData });
          })
          .catch((error) => {
            res.status(500).json({ status: "error", data: error });
          });
      }
    } catch (error) {
      res.status(500).json({ status: "error", data: error });
    }
  });
  
  
  
  
  
app.post("/register", async (req, res) => {
  const { FullName, email, password, Username } = req.body;
  const encrypted = await bcrypt.hash(password, 10);
  try {
    const emailExists = await User.exists({ email });
    const usernameExists = await User.exists({ Username });

    if (emailExists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    if (usernameExists) {
      return res.status(400).json({ error: "Username already exists" });
    }

    await User.create({
      FullName,
      email,
      password: encrypted,
      Username,
    });

    res.send({ status: "ok" });
  } catch (error) {
    res.status(500).send({ error: "Registration failed" });
  }
});

// Rest of the code remains the same

app.listen(8000, () => {
  console.log("Server started on port 8000");
});

