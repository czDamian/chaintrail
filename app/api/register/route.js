import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDb from "@/lib/mongodb";

// Connect to the database
await connectDb();

export async function POST(request) {
  const { userId, username } = await request.json();

  try {
    let user = await User.findOne({ userId });

    if (user) {
      return NextResponse.json({ message: "Welcome Back" });
    }

    user = new User({ userId, username, points: 950, playPass: 0 });
    await user.save();
    return NextResponse.json({ message: "Successfully registered" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// GET route to fetch user points
export async function GET(request) {
  const userId = request.nextUrl.searchParams.get("userId");

  try {
    const user = await User.findOne({ userId });
    if (user) {
      return NextResponse.json({
        points: user.points,
        playPass: user.playPass,
      });
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// Route for claiming daily reward or pass
export async function PUT(request) {
  const { userId, type } = await request.json();

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const now = new Date();

    if (type === "reward") {
      const lastClaim = user.lastClaimTimestamp
        ? new Date(user.lastClaimTimestamp)
        : new Date(0);
      const nextClaimTime = new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000);

      if (now < nextClaimTime) {
        return NextResponse.json({
          message: "Daily reward not available yet",
          nextClaimTime,
        });
      }

      user.points += 1200;
      user.lastClaimTimestamp = now;
      await user.save();

      return NextResponse.json({
        message: "Daily reward claimed",
        points: user.points,
        nextClaimTime: new Date(
          now.getTime() + 24 * 60 * 60 * 1000
        ).toISOString(),
      });
    } else if (type === "pass") {
      const lastClaimPass = user.lastClaimPassTimestamp
        ? new Date(user.lastClaimPassTimestamp)
        : new Date(0);
      const nextClaimPassTime = new Date(
        lastClaimPass.getTime() + 6 * 60 * 60 * 1000
      );

      if (now < nextClaimPassTime) {
        return NextResponse.json({
          message: "Daily pass not available yet",
          nextClaimPassTime,
        });
      }

      user.playPass += 1;
      user.lastClaimPassTimestamp = now;
      await user.save();

      return NextResponse.json({
        message: "Daily pass claimed",
        playPass: user.playPass,
        nextClaimPassTime: new Date(
          now.getTime() + 6 * 60 * 60 * 1000
        ).toISOString(),
      });
    } else {
      return NextResponse.json(
        { message: "Invalid claim type" },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
