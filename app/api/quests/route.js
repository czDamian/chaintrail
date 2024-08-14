// api/quests/route.js
import connectDb from "@/lib/mongodb";
import Quest from "@/models/Quest";
import { NextResponse } from "next/server";

// POST method to create a new quest
export async function POST(request) {
  try {
    await connectDb();
    const body = await request.json();
    const newQuest = new Quest(body);
    const savedQuest = await newQuest.save();
    return NextResponse.json(savedQuest, { status: 201 });
  } catch (error) {
    console.error("Error creating quest:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET method to retrieve quests and current quest details for a specific user
export async function GET(request) {
  try {
    await connectDb();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let quests;

    if (userId) {
      // Fetch the user's current quest
      const userResponse = await fetch(
        `/api/users?userId=${userId}`
      );
      const userData = await userResponse.json();

      if (userResponse.ok && userData.currentQuest) {
        // Fetch the current quest for the user
        quests = await Quest.find({ _id: userData.currentQuest })
      } else {
        // If no current quest found or user not found, return all quests
        quests = await Quest.find({}).sort("createdAt");
      }
    } else {
      // Fetch all quests if no userId is provided
      quests = await Quest.find({}).sort("createdAt");
    }

    return NextResponse.json(quests);
  } catch (error) {
    console.error("Error fetching quests:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// DELETE method to delete a quest by ID
export async function DELETE(request) {
  try {
    await connectDb();
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { error: "Quest ID is required" },
        { status: 400 }
      );
    }

    const deletedQuest = await Quest.findByIdAndDelete(id);

    if (!deletedQuest) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }
    return NextResponse.json(deletedQuest, { status: 200 });
  } catch (error) {
    console.error("Error deleting quest:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT method to update an existing quest by ID
export async function PUT(request) {
  try {
    await connectDb();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Quest ID is required" },
        { status: 400 }
      );
    }

    const updatedQuest = await Quest.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedQuest) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }
    return NextResponse.json(updatedQuest, { status: 200 });
  } catch (error) {
    console.error("Error updating quest:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
