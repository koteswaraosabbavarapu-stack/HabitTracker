const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    streak: {
      type: Number,
      default: 0
    },
    lastCompleted: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Habit", habitSchema);