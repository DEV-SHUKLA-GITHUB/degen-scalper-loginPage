const express = require("express");
  const jwt = require("jsonwebtoken");
  const mongoose = require("mongoose");
  const app = express();
  app.use(express.json());

  const JWT_SECRET = "hey";
  mongoose
    .connect(
      "mongodb+srv://hackingprotection11:deTtcjao8jWaWuwn@cluster0.64hlp4f.mongodb.net/?retryWrites=true&w=majority"
    )
    .then(() => console.log("db connected"))
    .catch((err) => {
      console.log(err);
    });
  const userSchema = mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      education: { type: String, required: true },
      city: { type: String, required: true },
      mobile: { type: Number, required: true },
    },
    {
      collection: "user-data",
    }
  );
  const userModel = mongoose.model("UserData", userSchema);
  const key = "key";
  app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Validate user credentials
    try {
      
      const user = await userModel.findOne({ email });
    console.log(user)


      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

    
      

      // If password is invalid, send an error response
      if (user.password!=password) {
        return res.status(400).json({ error: "Invalid credentials" });
      }


      const token = jwt.sign({ email: user.email }, JWT_SECRET);

      // Send the token as a response
      console.log("loged in")
      res.json({ status: "ok", token: token, data:user});
    } catch (error) {
      console.error("Login failed:", error);
      res.status(500).json({ error: "An error occurred during login" });
    }
  });
  app.post("/profile", verifyToken, (req, res) => {
    jwt.verify(req.token, key, (err, auth) => {
      if (err) {
        res.sendStatus({
          message: "Imvalid",
        });
      } else {
        res.json({
          message: "Profile ",
          auth,
        });
      }
    });
  });
  function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (!bearerHeader)
      res.send({
        result: "Invalid Token",
      });
    else {
      const bearer = bearerHeader.split(" ");
      const token = bearer[1];
      req.token = token;
      next();
    }
  }
  app.get("/",(req, res) => {
    res.json({
      message: "api",
    });
  });
  app.post("/signup",async(req,res)=>{
    const data=req.body
    await userModel.create({
      name:data.name,
      email:data.email,
      password:data.password,
      mobile:data.mobile,
      education:data.education,
      city:data.city,
    });

    res.send({ status: "ok" });

  })
  app.listen(3000, () => {
    console.log("first");
  });