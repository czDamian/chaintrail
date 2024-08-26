//api/users/route.js
import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDb from "@/lib/mongodb";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

function clearMongooseCache() {
  mongoose.models = {};
  mongoose.modelSchemas = {};
  console.log("Mongoose cache cleared.");
}

await connectDb();
clearMongooseCache();

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

export async function PATCH(request) {
  const userId = request.nextUrl.searchParams.get("userId");
  const saltRounds = 10;

  try {
    if (!userId) {
      return NextResponse.json(
        { message: "UserId is required" },
        { status: 400 }
      );
    }

    const { walletAddress = null, privateKey = null } = await request.json();

    let hashedPrivateKey = null;
    if (privateKey) {
      hashedPrivateKey = await bcrypt.hash(privateKey, saltRounds);
    }

    const user = await User.findOneAndUpdate(
      { userId },
      { walletAddress, privateKey: hashedPrivateKey },
      { new: true }
    );

    if (user) {
      return NextResponse.json(user);
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
