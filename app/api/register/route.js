import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDb from "@/lib/mongodb";
import { ethers } from "ethers";

await connectDb();

export async function POST(request) {
  const { userId, username } = await request.json();

  try {
    let user = await User.findOne({ userId });

    if (user) {
      // Check if wallet details are missing and update if needed
      if (!user.walletAddress) {
        // Generate a new wallet
        const wallet = ethers.Wallet.createRandom();
        const { address, privateKey } = wallet;
        const mnemonic = wallet.mnemonic.phrase;
        const publicKey = wallet.publicKey;

        // Update user with new wallet details
        user.walletAddress = address;
        user.publicKey = publicKey;
        user.privateKey = privateKey;
        user.mnemonic = mnemonic;
        await user.save();
      }

      return NextResponse.json({ message: "Welcome Back" });
    }

    // User does not exist, create a new user
    const wallet = ethers.Wallet.createRandom();
    const { address, privateKey } = wallet;
    const mnemonic = wallet.mnemonic.phrase;
    const publicKey = wallet.publicKey;

    user = new User({
      userId,
      username,
      points: 1000, // Assign 1000 points on successful registration
      playPass: 0,
      walletAddress: address,
      publicKey,
      privateKey,
      mnemonic,
    });

    await user.save();
    return NextResponse.json({ message: "Registration successful" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

