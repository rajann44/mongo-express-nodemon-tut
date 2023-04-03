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

//ROUTE 2: Add note using POST: /api/notes/addnote [Login Required]
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

//ROUTE 3: Update note using PUT: /api/notes/updatenote [Login Required]
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    //Create a newNote object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //Find note to be updated
    //Find is Note present in DB?
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Note Not found :(");
    }
    //First checking if I own the Note?
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed to update :(");
    }

    const updatedNote = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true } //By default, when you update a document in MongoDB, the findOneAndUpdate() method returns the original document before it was updated. If you want to get the updated document instead, you can set the new option to true.
    );
    res.json({ updatedNote });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//ROUTE 4: Delete note using DELETE: /api/notes/updatenote [Login Required]
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    //Find note to be delete
    //Find is Note present in DB?
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Note Not found :(");
    }
    //First checking if I own the Note and only then allow to delete
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed to delete :(");
    }

    const deletedNote = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note is deleted" + deletedNote });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
