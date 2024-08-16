//model for registering and updating user
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    username: String,
    points: { type: Number, default: 950 },
    playPass: { type: Number, default: 10 },
    lastClaimTimestamp: { type: Date },
    referralCount: { type: Number, default: 0 },
    referralCode: { type: String, unique: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    currentQuest: { type: mongoose.Schema.Types.ObjectId, ref: "Quest" },
    completedQuests: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Quest",
      default: [],
    },
    currentQuestion: { type: Object, default: {} },
    walletAddress: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
    privateKey: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
  },
  { timestamps: true }
);

delete mongoose.models.User;
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
