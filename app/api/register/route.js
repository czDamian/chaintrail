import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDb from "@/lib/mongodb";

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

// GET route to fetch user points and next claim time
export async function GET(request) {
  const userId = request.nextUrl.searchParams.get("userId");

  try {
    const user = await User.findOne({ userId });
    if (user) {
      const nextClaimTime = user.lastClaimTimestamp
        ? new Date(user.lastClaimTimestamp.getTime() + 24 * 60 * 60 * 1000)
        : null;

      return NextResponse.json({
        points: user.points,
        playPass: user.playPass,
        nextClaimTime: nextClaimTime ? nextClaimTime.toISOString() : null,
      });
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// Route for claiming daily reward and daily pass
export async function PUT(request) {
  const { userId } = await request.json();

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const now = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const lastClaim = user.lastClaimTimestamp
      ? new Date(user.lastClaimTimestamp)
      : new Date(0);
    const nextClaimTime = new Date(lastClaim.getTime() + oneDayMs);

    if (now < nextClaimTime) {
      return NextResponse.json({
        message: "Daily reward and pass not available yet",
        nextClaimTime: nextClaimTime.toISOString(),
      });
    }

    user.points += 1200;
    user.playPass += 4;
    user.lastClaimTimestamp = now;
    await user.save();

    return NextResponse.json({
      message: "Daily reward and pass claimed",
      points: user.points,
      playPass: user.playPass,
      nextClaimTime: new Date(now.getTime() + oneDayMs).toISOString(),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
