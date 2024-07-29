// models/Quest.js
import mongoose from "mongoose";

const questQuestionSchema = new mongoose.Schema({
  img1: { type: String, required: true },
  img2: { type: String, required: true },
  img3: { type: String, required: true },
  img4: { type: String, required: true },
  hint: { type: String, required: true },
  isAnswered: { type: Boolean, default: false },
  questAnswer: { type: String, required: true },
  scrambledAnswer: { type: String, required: true },
});

const questSchema = new mongoose.Schema({
  questName: { type: String, required: true },
  questImage: { type: String, required: true },
  questStatus: { type: String, required: true },
  questQuestions: { type: [questQuestionSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Quest || mongoose.model("Quest", questSchema);
