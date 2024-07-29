import connectDb from "@/lib/mongodb"; // Your MongoDB connection utility
import Quest from "@/models/Quest"; // Import models after clearing cache
import { NextResponse } from "next/server";

// POST method to create a new quest
export async function POST(request) {
  try {
    // Connect to the database
    await connectDb();
    console.log("Connected to the database");

    // Parse the request body
    const body = await request.json();
    console.log("Received quest data:", body);

    // Create a new quest document
    const newQuest = new Quest(body);
    console.log("Created new Quest object:", newQuest);

    // Save the quest to the database
    const savedQuest = await newQuest.save();
    console.log("Saved quest to database:", savedQuest);

    // Return the saved quest as the response
    return NextResponse.json(savedQuest, { status: 201 });
  } catch (error) {
    console.error("Error creating quest:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET method to retrieve all quests
export async function GET() {
  try {
    // Connect to the database
    await connectDb();
    console.log("Connected to the database");

    // Fetch all quests from the database
    const quests = await Quest.find({});
    console.log("Retrieved quests from database:", quests);

    // Return the quests as the response
    return NextResponse.json(quests);
  } catch (error) {
    console.error("Error fetching quests:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
