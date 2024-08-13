//model for creating quests
import mongoose from "mongoose";
import QuestQuestion from "./QuestQuestion";

const questSchema = new mongoose.Schema(
  {
    questName: { type: String, required: true, unique: true },
    questImage: { type: String, required: true },
    questStatus: {
      type: String,
      required: true,
      enum: ["locked", "unlocked", "completed"],
      default: "locked",
    },
    questDescription: { type: String, required: true },
    questQuestions: { type: [QuestQuestion.schema], default: [] },
    order: { type: Number, required: true, unique: true },
  },
  { timestamps: true }
);

questSchema.virtual("completionRate").get(function () {
  const answeredQuestions = this.questQuestions.filter(
    (q) => q.isAnswered
  ).length;
  return (answeredQuestions / this.questQuestions.length) * 100;
});

delete mongoose.models.Quest;

const Quest = mongoose.models.Quest || mongoose.model("Quest", questSchema);

export default Quest;