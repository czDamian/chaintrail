import { NextResponse } from "next/server";
import User from "@/models/User";
import Counter from "@/models/Counter";
import connectDb from "@/lib/mongodb";
import Quest from "@/models/Quest";

await connectDb();

export async function POST(request) {
  const { userId, username, referralCode } = await request.json();

  try {
    if (userId.startsWith("0x")) {
      if (userId.length < 12) {
        throw new Error(
          "Wallet address should be at least 10 characters long."
        );
      }
      return await registerWithWallet(userId, username, referralCode);
    } else if (/^\d{8,}$/.test(userId)) {
      return await registerWithTelegram(userId, username, referralCode);
    } else {
      throw new Error("Register with Telegram or wallet address only");
    }
  } catch (err) {
    console.error("Error registering user:", err);
    return NextResponse.json(
      { message: err.message || "Server error", error: err.message },
      { status: 500 }
    );
  }
}

async function registerWithTelegram(userId, username, referralCode) {
  let user = await User.findOne({ userId });

  if (user) {
    // Check if referral code or current Quest is missing or invalid and update
    if (!user.currentQuest) {
      const firstQuest = await Quest.findOne({}).sort({ createdAt: 1 });
      if (firstQuest) {
        user.currentQuest = firstQuest._id;
      }
    }

    if (!user.referralCode) {
      user.referralCode = await generateAutoIncrementalReferralCode();
    }

    await user.save();

    return NextResponse.json({
      message: "Welcome Back",
      referredBy: user.referredBy || "No referrer",
      platform: "telegram",
      referralCode: `Your referral code is ${user.referralCode}`,
    });
  }

  const newReferralCode = await generateAutoIncrementalReferralCode();
  const firstQuest = await Quest.findOne({}).sort({ createdAt: 1 });

  user = new User({
    userId,
    username,
    points: 1000,
    playPass: 2,
    platform: "telegram",
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
      user.referredBy = referringUser.username || referringUser.userId;
    } else {
      console.warn("Referral code not found:", referralCode);
    }
  }

  await user.save();

  return NextResponse.json({
    message: "Registration successful",
    referredBy: user.referredBy || "No referrer",
    platform: "telegram",
    referralCode: `Your referral code is ${user.referralCode}`,
  });
}

async function registerWithWallet(userId, username, referralCode) {
  let user = await User.findOne({ userId });

  if (user) {
    // Check if referral code or current Quest is missing or invalid and update
    if (!user.currentQuest) {
      const firstQuest = await Quest.findOne({}).sort({ createdAt: 1 });
      if (firstQuest) {
        user.currentQuest = firstQuest._id;
      }
    }

    if (!user.referralCode) {
      user.referralCode = await generateAutoIncrementalReferralCode();
    }

    await user.save();

    return NextResponse.json({
      message: "Welcome Back",
      referredBy: user.referredBy || "No referrer",
      platform: "wallet",
      referralCode: `Your referral code is ${user.referralCode}`,
    });
  }

  const newReferralCode = await generateAutoIncrementalReferralCode();
  const firstQuest = await Quest.findOne({}).sort({ createdAt: 1 });

  user = new User({
    userId,
    username,
    points: 1000,
    playPass: 2,
    platform: "wallet",
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
      user.referredBy = referringUser.username || referringUser.userId;
    } else {
      console.warn("Referral code not found:", referralCode);
    }
  }

  await user.save();

  return NextResponse.json({
    message: "Registration successful",
    referredBy: user.referredBy || "No referrer",
    platform: "wallet",
    referralCode: `Your referral code is ${user.referralCode}`,
  });
}

async function generateAutoIncrementalReferralCode() {
  const counter = await Counter.findOneAndUpdate(
    { name: "referralCode" },
    { $inc: { sequenceValue: 1 } },
    { new: true, upsert: true }
  );

  return counter.sequenceValue.toString().padStart(4, "0");
}
