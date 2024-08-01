// app/api/quests/[questId]/questions/route.js

import mongoose from "mongoose";
import connectDb from "@/lib/mongodb";
import Quest from "@/models/Quest";
import QuestQuestion from "@/models/QuestQuestion";
import { NextResponse } from "next/server";

// Function to clear Mongoose model cache
const clearModelCache = () => {
  const modelKeys = Object.keys(mongoose.models);
  modelKeys.forEach((key) => {
    delete mongoose.models[key];
  });
};

export async function POST(request, { params }) {
  try {
    const { questId } = params;
    console.log("Received questId:", questId);

    if (!questId) {
      throw new Error("Quest ID is required");
    }
    clearModelCache();

    await connectDb();
    console.log("Connected to the database");
    const body = await request.json();
    console.log("Received request body:", body);

    const quest = await Quest.findById(questId);
    console.log("Quest found:", quest);

    if (!quest) {
      console.error("Quest not found:", questId);
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }
    const newQuestQuestion = new QuestQuestion(body);
    console.log("Created new QuestQuestion object:", newQuestQuestion);

    quest.questQuestions.push(newQuestQuestion);
    await quest.save();

    return NextResponse.json(newQuestQuestion, { status: 201 });
  } catch (error) {
    console.error("Error adding question to quest:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// to retrieve all quest questions for a specific quest
export async function GET(request, { params }) {
  try {
    const { questId } = params;
    console.log("Received questId:", questId);

    if (!questId) {
      throw new Error("Quest ID is required");
    }
    clearModelCache();

    await connectDb();
    const quest = await Quest.findById(questId).populate("questQuestions");
    if (!quest) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    return NextResponse.json(quest.questQuestions);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
