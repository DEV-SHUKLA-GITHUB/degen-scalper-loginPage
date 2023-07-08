const KiteConnect = require("kiteconnect").KiteConnect;
const WebSocket = require('ws');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const User = require("../../models/userDetails"); // Import the user schema from userDetails.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "slkdfjlasdfkajsdlkfaksdflaksdjfoajsdofjodsf";


module.exports=router;

