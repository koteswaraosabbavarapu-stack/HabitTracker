const express = require("express");
const router = express.Router();
const { protect,allowedTo } = require("../middleware/authMiddleware");
const Habit = require("../models/Habit");
const { sendStreakMilestoneEmail } = require("../utils/sendEmails");
const User = require("../models/User");
// Get habits
router.get("/", protect,allowedTo('admin', 'user'), async (req, res) => {
  const habits = await Habit.find({ userId: req.user._id });
  res.json(habits);
});

//Get statistics
router.get("/stats", protect,allowedTo('admin', 'user'), async (req, res) => {
  const totalHabits = await Habit.countDocuments({ userId: req.user._id });
  const completedHabits = await Habit.countDocuments({ userId: req.user._id, streak: { $gt: 0 } });
  let longestStreak = 0;
  const habits = await Habit.find({ userId: req.user._id });
  for(let habit of habits){
    if(habit.streak>longestStreak){
      longestStreak=habit.streak;
    }
  }
  res.json({totalHabits, completedHabits, longestStreak});
});

// Add habit
router.post("/", protect,allowedTo('admin', 'user'), async (req, res) => {
  const habit = await Habit.create({
    userId: req.user._id,
    title: req.body.title,
    streak: 0,
    lastCompleted: null
  });

  res.json(habit);
});

// Complete habit
router.put("/:id/complete", protect,allowedTo('admin', 'user'), async (req, res) => {
  const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });

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

  // ─── send streak milestone email ─────────────────────────
   const milestones = [7, 30, 100]
  if (milestones.includes(habit.streak)) {
    const user = await User.findById(req.user._id)
    await sendStreakMilestoneEmail(user.email, user.name, habit.streak)
  }

  res.json(habit);
});

// Delete habit
router.delete("/:id", protect,allowedTo('admin'), async (req, res) => {
  await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

  res.json({
    message: "Deleted"
  });
});

module.exports = router;