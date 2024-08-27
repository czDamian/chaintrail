//model for creating quests
import mongoose from "mongoose";
import QuestQuestion from "./QuestQuestion";

const questSchema = new mongoose.Schema(
  {
    questName: { type: String, required: true, unique: true },
    questImage: { type: String, required: true },
    questDescription: { type: String, required: true },
    questQuestions: { type: [QuestQuestion.schema], default: [] },
    addedBy: { type: String, required: true },
    lastEditedBy: { type: String },
  },
  { timestamps: true }
);
delete mongoose.models.Quest;

const Quest = mongoose.models.Quest || mongoose.model("Quest", questSchema);

export default Quest;
