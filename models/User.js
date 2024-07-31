import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    username: String,
    points: { type: Number, default: 950 },
    playPass: { type: Number, default: 10 },
    lastClaimTimestamp: { type: Date },
    lastClaimPassTimestamp: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
