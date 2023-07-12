const express = require('express');
const router = express.Router();
const User = require("../models/userDetails");
const { checkAuth } = require("../modules/auth");

router.post("/", async (req, res) => {
  const { token, username } = req.body;
  console.log(checkAuth);

  const checkAuthResponse = await checkAuth(token);
  if (!checkAuthResponse.status) {
    res.status(500).json({ status: "error", msg: "JWT authentication failed" });
  }

  const data = checkAuthResponse.data;
  res.json({ status: "ok", data });
});

module.exports = router;
