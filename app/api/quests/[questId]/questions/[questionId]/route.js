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

// PATCH method to update a specific quest question
export async function PATCH(request, { params }) {
  try {
    const { questId, questionId } = params;
    console.log("Received questId and questionId:", questId, questionId);

    if (!questId || !questionId) {
      throw new Error("Quest ID and Question ID are required");
    }
    clearModelCache();

    await connectDb();
    console.log("Connected to the database");

    const body = await request.json();
    console.log("Received request body:", body);

    const quest = await Quest.findById(questId).populate("questQuestions");
    console.log("Quest found:", quest);

    if (!quest) {
      console.error("Quest not found:", questId);
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    const question = quest.questQuestions.id(questionId);
    if (!question) {
      console.error("Question not found:", questionId);
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    Object.assign(question, body);
    await quest.save();

    return NextResponse.json(question, { status: 200 });
  } catch (error) {
    console.error("Error updating question in quest:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
