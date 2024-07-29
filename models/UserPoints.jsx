import mongoose from "mongoose";

const UserPointsSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    points: { type: Number, default: 950 },
    lastClaimTimestamp: { type: Date },
    playpass: { type: Number, default: 10 },
    lastClaimPassTimestamp: { type: Date },
  },
  { timestamps: true }
);

const UserPoint =
  mongoose.models.UserPoint || mongoose.model("UserPoint", UserPointsSchema);

export default UserPoint;
