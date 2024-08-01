import mongoose from "mongoose";

const QuestQuestionSchema = new mongoose.Schema(
  {
    img1: { type: String, required: true },
    img2: { type: String, required: true },
    img3: { type: String, required: true },
    img4: { type: String, required: true },
    hint: { type: String, required: true },
    isAnswered: { type: Boolean, default: false },
    questAnswer: { type: String, required: true },
    scrambledAnswer: { type: String, required: true },
  },
  { timestamps: true }
);

const QuestQuestion =
  mongoose.models.QuestQuestion ||
  mongoose.model("QuestQuestion", QuestQuestionSchema);

export default QuestQuestion;
