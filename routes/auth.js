const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

//Create user using POST: /api/auth/createuser [No Login Required]
router.post(
  "/createuser",
  [
    body("email", "Please Enter Valid Email").isEmail(),
    body("name", "Name must be minimum 3 char").isLength({ min: 3 }),
    body("password", "Password must be minimum 5 char").isLength({ min: 5 }),
  ],
  async (req, res) => {
    //If there are Error return Bad request and Error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      //Check weather email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "Sorry User already exists" });
      }
      //Otherwise Create user
      user = User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      res.json({ user });
    } catch (error) {
      res.status(500).json("Something went wrong, server error");
    }
  }
);

module.exports = router;
