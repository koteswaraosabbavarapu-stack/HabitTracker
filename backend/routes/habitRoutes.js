const express = require("express");
const router = express.Router();

const Habit = require("../models/Habit");

// Get habits
router.get("/", async (req, res) => {
  const habits = await Habit.find();
  res.json(habits);
});

// Add habit
router.post("/", async (req, res) => {
  const habit = await Habit.create({
    title: req.body.title
  });

  res.json(habit);
});

// Complete habit
router.put("/:id/complete", async (req, res) => {
  const updated = await Habit.findByIdAndUpdate(
    req.params.id,
    { completed: true },
    { new: true }
  );

  res.json(updated);
});

// Delete habit
router.delete("/:id", async (req, res) => {
  await Habit.findByIdAndDelete(req.params.id);

  res.json({
    message: "Deleted"
  });
});

module.exports = router;