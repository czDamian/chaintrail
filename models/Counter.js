import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  sequenceValue: { type: Number, default: 1 },
});

delete mongoose.models.Counter;
const Counter =
  mongoose.models.Counter || mongoose.model("Counter", CounterSchema);

export default Counter;
