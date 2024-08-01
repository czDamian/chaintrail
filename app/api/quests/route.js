// api/quests/route.js
import connectDb from "@/lib/mongodb";
import Quest from "@/models/Quest";
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

    // Return the saved quest
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

// DELETE method to remove a quest by ID
export async function DELETE(request) {
  try {
    // Connect to the database
    await connectDb();
    console.log("Connected to the database");

    // Parse the request body to get the quest ID
    const { id } = await request.json();
    console.log("Received quest ID for deletion:", id);

    // Ensure the ID is provided
    if (!id) {
      return NextResponse.json(
        { error: "Quest ID is required" },
        { status: 400 }
      );
    }

    // Find and delete the quest with the given ID
    const deletedQuest = await Quest.findByIdAndDelete(id);

    // Check if a quest was deleted
    if (!deletedQuest) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    console.log("Deleted quest from database:", deletedQuest);

    // Return the deleted quest as the response
    return NextResponse.json(deletedQuest, { status: 200 });
  } catch (error) {
    console.error("Error deleting quest:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT method to update an existing quest by ID
export async function PUT(request) {
  try {
    // Connect to the database
    await connectDb();
    console.log("Connected to the database");

    // Parse the request body
    const body = await request.json();
    console.log("Received quest data for update:", body);

    const { id, ...updateData } = body;

    // Ensure the ID is provided
    if (!id) {
      return NextResponse.json(
        { error: "Quest ID is required" },
        { status: 400 }
      );
    }

    // Find and update the quest with the given ID
    const updatedQuest = await Quest.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    // Check if a quest was updated
    if (!updatedQuest) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    console.log("Updated quest in database:", updatedQuest);

    // Return the updated quest as the response
    return NextResponse.json(updatedQuest, { status: 200 });
  } catch (error) {
    console.error("Error updating quest:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
