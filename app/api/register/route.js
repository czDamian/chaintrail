import { NextResponse } from "next/server";
import User from "@/models/User";
import Counter from "@/models/Counter";
import connectDb from "@/lib/mongodb";
import { ethers } from "ethers";
import Quest from "@/models/Quest";

await connectDb();

export async function POST(request) {
  const { userId, username, referralCode } = await request.json();

  try {
    let user = await User.findOne({ userId });

    if (user) {
      // Check if wallet details or referral code are missing or invalid and update if needed
      if (!user.walletAddress || !ethers.isAddress(user.walletAddress)) {
        const walletDetails = createWalletWithMnemonic();
        Object.assign(user, walletDetails);
      }
      if (user.currentQuest == "") {
        const firstQuest = await Quest.findOne({}).sort({ createdAt: 1 });
        Object.assign(user, firstQuest);
      }
      if (!user.referralCode) {
        user.referralCode = await generateAutoIncrementalReferralCode();
      }
      await user.save();

      return NextResponse.json({
        message: "Welcome Back",
        walletAddress: user.walletAddress,
        referralCode: user.referralCode,
      });
    }

    // User does not exist, create a new user with a wallet and referral code
    const walletDetails = createWalletWithMnemonic();
    const newReferralCode = await generateAutoIncrementalReferralCode();

    // Fetch the first quest
    const firstQuest = await Quest.findOne({}).sort({ createdAt: 1 });

    user = new User({
      userId,
      username,
      points: 1000,
      playPass: 2,
      walletAddress: walletDetails.walletAddress,
      privateKey: walletDetails.privateKey,
      referralCode: newReferralCode,
      currentQuest: firstQuest ? firstQuest._id : null,
    });

    // Handle the referral code logic
    if (referralCode) {
      const referringUser = await User.findOne({ referralCode });
      if (referringUser) {
        referringUser.referralCount = (referringUser.referralCount || 0) + 1;
        referringUser.points = (referringUser.points || 0) + 1000;
        await referringUser.save();
      } else {
        console.warn("Referral code not found:", referralCode);
      }
    }

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
