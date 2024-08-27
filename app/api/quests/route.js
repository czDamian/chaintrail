// api/quests/route.js
import connectDb from "@/lib/mongodb";
import Quest from "@/models/Quest";
import User from "@/models/User";
import { NextResponse } from "next/server";

// POST method to create a new quest
export async function POST(request) {
  try {
    await connectDb();
    const body = await request.json();
    const userId = body.addedBy;
    const user = await User.findOne({ userId });
    if (!user || user.role !== "admin") {
      throw new Error("Only admins can create quests");
    }

    const newQuest = new Quest(body);
    const savedQuest = await newQuest.save();
    return NextResponse.json(savedQuest, { status: 201 });
  } catch (error) {
    console.error("Error creating quest:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET method to retrieve all quests
export async function GET(request) {
  try {
    await connectDb();
    const userId = request.nextUrl.searchParams.get("userId");

    const quests = await Quest.find({}).sort("createdAt");

    // Fetch user progress if userId is provided
    let updatedQuests = quests;
    if (userId) {
      const user = await User.findOne({ userId });
      const { currentQuest, completedQuests } = user;

      // Update quests with status based on user progress
      updatedQuests = quests.map((quest) => {
        let questStatus = "locked";
        let isLinkDisabled = true;

        if (completedQuests.includes(quest._id.toString())) {
          questStatus = "completed";
          isLinkDisabled = true;
        } else if (quest._id.toString() === currentQuest.toString()) {
          questStatus = "open";
          isLinkDisabled = false;
        }

        return { ...quest.toObject(), questStatus, isLinkDisabled };
      });

      // Sort quests: Completed first, then open, then locked
      updatedQuests = updatedQuests.sort((a, b) => {
        if (a.questStatus === "completed" && b.questStatus !== "completed") {
          return -1;
        }
        if (a.questStatus === "open" && b.questStatus !== "open") {
          return b.questStatus === "completed" ? 1 : -1;
        }
        if (a.questStatus === "locked" && b.questStatus !== "locked") {
          return 1;
        }
        return 0;
      });
    }

    return NextResponse.json(updatedQuests);
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

    const userId = request.headers.get("userId");

    console.log("userid", userId);
    console.log("id", id);

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    const user = await User.findOne({ userId });
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can delete quests" },
        { status: 403 }
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

    const userId = request.headers.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "only admins can edit quests" },
        { status: 403 }
      );
    }

    const updatedQuest = await Quest.findByIdAndUpdate(
      id,
      {
        ...updateData,
      },
      {
        new: true,
      }
    );

    if (!updatedQuest) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }
    return NextResponse.json(updatedQuest, { status: 200 });
  } catch (error) {
    console.error("Error updating quest:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
