import { NextResponse } from "next/server";
import User from "@/models/User";
import Counter from "@/models/Counter"; // Import the Counter model
import connectDb from "@/lib/mongodb";
import { ethers } from "ethers";

await connectDb();

export async function POST(request) {
  const { userId, username } = await request.json();

  try {
    let user = await User.findOne({ userId });

    if (user) {
      // Check if wallet details or referral code are missing, invalid, or without mnemonic and update if needed
      if (
        !user.walletAddress ||
        !ethers.isAddress(user.walletAddress) ||
        !user.mnemonic
      ) {
        const walletDetails = createWalletWithMnemonic();
        Object.assign(user, walletDetails);
      }
      if (!user.referralCode) {
        user.referralCode = await generateAutoIncrementalReferralCode();
      }
      await user.save();
      console.log("Updated existing user with new details:", user);

      return NextResponse.json({
        message: "Welcome Back",
        walletAddress: user.walletAddress,
        referralCode: user.referralCode,
      });
    }

    // User does not exist, create a new user with a wallet and referral code
    const walletDetails = createWalletWithMnemonic();
    const referralCode = await generateAutoIncrementalReferralCode();
    user = new User({
      userId,
      username,
      points: 1000,
      playPass: 10,
      walletAddress: walletDetails.walletAddress,
      publicKey: walletDetails.publicKey,
      privateKey: walletDetails.privateKey,
      mnemonic: walletDetails.mnemonic,
      referralCode,
    });

    console.log("New user before save:", user);
    await user.save();
    // Verify the saved user
    const savedUser = await User.findOne({ userId }).lean();
    console.log("Saved user from database:", savedUser);

    return NextResponse.json({
      message: "Registration successful",
      walletAddress: user.walletAddress,
      referralCode: user.referralCode,
    });
  } catch (err) {
    console.error("Error in POST route:", err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

function createWalletWithMnemonic() {
  const wallet = ethers.Wallet.createRandom();
  const walletDetails = {
    walletAddress: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase,
  };
  console.log("Created wallet details:", walletDetails);
  return walletDetails;
}

async function generateAutoIncrementalReferralCode() {
  const counter = await Counter.findOneAndUpdate(
    { name: "referralCode" },
    { $inc: { sequenceValue: 1 } },
    { new: true, upsert: true }
  );

  const referralCode = counter.sequenceValue.toString().padStart(4, "0");
  return referralCode;
}
