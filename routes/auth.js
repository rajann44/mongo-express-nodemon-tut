const express = require("express");
const router = express.Router();
const User = require("../models/User");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../uri");
const { body, validationResult } = require("express-validator");
const JWT_SECRETKEY = JWT_SECRET;

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

      var salt = bcrypt.genSaltSync(10);
      const securePass = await bcrypt.hash(req.body.password, salt);
      //Otherwise Create user
      user = User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePass,
      });

      const userID = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(userID, JWT_SECRETKEY);
      res.json({ authToken });
    } catch (error) {
      res.status(500).json("Something went wrong, Internal server error");
    }
  }
);

//Authenticate user using POST: /api/auth/login [No Login Required]
router.post(
  "/login",
  [
    body("email", "Please Enter Valid Email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    //If there are Error return Bad request and Error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid Creds Sorry :(" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ error: "Invalid Creds Sorry :(" });
      }
      const userID = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(userID, JWT_SECRETKEY);
      res.json({ authToken });
    } catch (error) {
      res.status(500).json("Something went wrong, Internal server error");
    }
  }
);

module.exports = router;
