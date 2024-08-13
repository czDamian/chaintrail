// New route to handle quest completion
// api/quests/complete/route.js
import connectDb from "@/lib/mongodb";
import Quest from "@/models/Quest";
import User from "@/models/User";
import { NextResponse } from "next/server";


export async function POST(request) {
  try {
    await connectDb();
    const { userId, questId } = await request.json();
    const user = await User.findOne({ userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    user.completedQuests.push(questId);
    await user.save();

    const nextQuest = await Quest.findOne({
      order: { $gt: user.currentQuest.order },
    }).sort("order");
    if (nextQuest) {
      nextQuest.questStatus = "unlocked";
      await nextQuest.save();
    }

    return NextResponse.json({ message: "Quest completed successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
