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
    publicKey: { type: String, unique: true },
    privateKey: { type: String, unique: true, select: false },
    mnemonic: { type: String, unique: true, select: false },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
