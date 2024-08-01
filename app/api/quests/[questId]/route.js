// /api/quests/[questId]/route.js
//for fetching and updating single quest only
import connectDb from "@/lib/mongodb";
import Quest from "@/models/Quest";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectDb();
    const questId = params.questId;

    if (!questId) {
      return NextResponse.json(
        { error: "Quest ID is required" },
        { status: 400 }
      );
    }

    const quest = await Quest.findById(questId);

    if (!quest) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    return NextResponse.json(quest);
  } catch (error) {
    console.error("Error fetching quest:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}





export async function PUT(request, { params }) {
  try {
    await connectDb();
    const questId = params.questId;

    if (!questId) {
      return NextResponse.json({ error: "Quest ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const updatedQuest = await Quest.findByIdAndUpdate(questId, body, { new: true });

    if (!updatedQuest) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    return NextResponse.json(updatedQuest);
  } catch (error) {
    console.error("Error updating quest:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
