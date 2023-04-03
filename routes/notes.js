const express = require("express");
const Notes = require("../models/Notes");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

//ROUTE 1: Create note using GET: /api/notes/getnotes [Login Required]
router.get("/fetchnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    res.status(500).json("Something went wrong, Internal server error");
  }
});

//ROUTE 2: And note using POST: /api/notes/addnote [Login Required]
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Please Enter Valid Title").isLength({ min: 5 }),
    body("description", "Name must be minimum 3 char").isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({ title, description, tag, user: req.user.id });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong, notes not added" });
    }
  }
);

module.exports = router;
