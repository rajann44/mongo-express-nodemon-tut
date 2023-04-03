const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

//Create user using POST: /api/auth [No Auth Required]
router.post(
  "/",
  [
    body("email", "Please Enter Valid Email").isEmail(),
    body("name", "Name must be minimum 3 char").isLength({ min: 3 }),
    body("password", "Password must be minimum 5 char").isLength({ min: 5 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
      .then((user) => res.json(user))
      .catch((err) => res.json("Please Enter unique email "));
    //res.send(req.body);
  }
);

module.exports = router;
