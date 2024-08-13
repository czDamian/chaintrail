// route to handle user progress
// api/users/progress/route.js
import connectDb from "@/lib/mongodb";
import Quest from "@/models/Quest";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDb();
    // Get the userId from the query parameters
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    const user = await User.findOne({ userId }).populate("currentQuest");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      currentQuest: user.currentQuest._id,
      currentQuestion: user.currentQuestion,
      completedQuests: user.completedQuests,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDb();
    const { userId, questId, questionNumber } = await request.json();
    const user = await User.findOneAndUpdate(
      { userId },
      { currentQuest: questId, currentQuestion: questionNumber },
      { new: true }
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
