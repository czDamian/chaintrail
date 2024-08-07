//api/users/route.js
import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDb from "@/lib/mongodb";

await connectDb();

export async function GET(request) {
  const userId = request.nextUrl.searchParams.get("userId");

  try {
    if (userId) {
      // Fetch a single user by userId
      const user = await User.findOne({ userId });
      if (user) {
        return NextResponse.json(user);
      } else {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
    } else {
      // Fetch all users
      const users = await User.find({});
      return NextResponse.json(users);
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
