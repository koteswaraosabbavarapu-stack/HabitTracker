const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Habit = require("../models/Habit");

// Get habits
router.get("/", protect, async (req, res) => {
  const habits = await Habit.find();
  res.json(habits);
});

//Get statistics
router.get("/stats", protect, async (req, res) => {
  const totalHabits = await Habit.countDocuments();
  const completedHabits = await Habit.countDocuments({ streak: { $gt: 0 } });
  let longestStreak = 0;
  const habits = await Habit.find();
  for(let habit of habits){
    if(habit.streak>longestStreak){
      longestStreak=habit.streak;
    }
  }
  res.json({totalHabits, completedHabits, longestStreak});
});

// Add habit
router.post("/", protect, async (req, res) => {
  const habit = await Habit.create({
    title: req.body.title,
    streak: 0,
    lastCompleted: null
  });

  res.json(habit);
});

// Complete habit
router.put("/:id/complete", protect, async (req, res) => {
  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    return res.status(404).json({
      message: "Habit not found"
    });
  }

  const today = new Date();

  const last = habit.lastCompleted
    ? new Date(habit.lastCompleted)
    : null;

  if (last) {
    const diffDays = Math.floor(
      (today - last) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      return res.json(habit);
    }

    if (diffDays === 1) {
      habit.streak += 1;
    } else {
      habit.streak = 1;
    }
  } else {
    habit.streak = 1;
  }

  habit.lastCompleted = today;

  await habit.save();

  res.json(habit);
});

// Delete habit
router.delete("/:id", protect, async (req, res) => {
  await Habit.findByIdAndDelete(req.params.id);

  res.json({
    message: "Deleted"
  });
});

module.exports = router;