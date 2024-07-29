// app/api/quests/[questId]/questions/route.js

import mongoose from "mongoose";
import connectDb from "@/lib/mongodb"; // Your MongoDB connection utility
import Quest from "@/models/Quest"; // Import Quest model
import QuestQuestion from "@/models/QuestQuestion"; // Import QuestQuestion model
import { NextResponse } from "next/server";

// Function to clear Mongoose model cache
const clearModelCache = () => {
  const modelKeys = Object.keys(mongoose.models);
  modelKeys.forEach((key) => {
    delete mongoose.models[key];
  });
};

// POST method to create a new quest question
export async function POST(request, { params }) {
  try {
    const { questId } = params; // Extract questId from params
    console.log("Received questId:", questId);

    if (!questId) {
      throw new Error("Quest ID is required");
    }

    // Clear Mongoose model cache
    clearModelCache();

    await connectDb();
    console.log("Connected to the database");

    // Parse the request body
    const body = await request.json();
    console.log("Received request body:", body);

    // Find the quest by ID
    const quest = await Quest.findById(questId);
    console.log("Quest found:", quest);

    if (!quest) {
      console.error("Quest not found:", questId);
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    // Create a new quest question document
    const newQuestQuestion = new QuestQuestion(body);
    console.log("Created new QuestQuestion object:", newQuestQuestion);

    // Add the new quest question to the quest's questQuestions array
    quest.questQuestions.push(newQuestQuestion);
    await quest.save();

    return NextResponse.json(newQuestQuestion, { status: 201 });
  } catch (error) {
    console.error("Error adding question to quest:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET method to retrieve all quest questions for a specific quest
export async function GET(request, { params }) {
  try {
    const { questId } = params; // Extract questId from params
    console.log("Received questId:", questId);

    if (!questId) {
      throw new Error("Quest ID is required");
    }

    // Clear Mongoose model cache
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
