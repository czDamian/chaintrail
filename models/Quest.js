import mongoose from "mongoose";
import QuestQuestion from "./QuestQuestion";

const questSchema = new mongoose.Schema(
  {
    questName: { type: String, required: true },
    questImage: { type: String, required: true },
    questStatus: { type: String, required: true },
    questDescription: { type: String, required: true },
    questQuestions: { type: [QuestQuestion.schema], default: [] },
  },
  { timestamps: true }
);

const Quest = mongoose.models.Quest || mongoose.model("Quest", questSchema);

export default Quest;
