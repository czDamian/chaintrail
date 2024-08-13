//model for registering and updating user
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    username: String,
    points: { type: Number, default: 950 },
    playPass: { type: Number, default: 10 },
    lastClaimTimestamp: { type: Date },
    walletAddress: { type: String, unique: true },
    referralCount: { type: Number, default: 0 },
    referralCode: { type: String, unique: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    privateKey: { type: String, unique: true },
    currentQuest: { type: mongoose.Schema.Types.ObjectId, ref: "Quest" },
    currentQuestion: { type: Number, default: 0 },
    completedQuests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quest" }],
  },
  { timestamps: true }
);
delete mongoose.models.User;
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
