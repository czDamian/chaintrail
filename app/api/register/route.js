import { NextResponse } from "next/server";
import User from "@/models/User";
import Counter from "@/models/Counter";
import connectDb from "@/lib/mongodb";
import Web3 from "web3";
import Quest from "@/models/Quest";

await connectDb();

const saltRounds = 10;
export async function POST(request) {
  const { userId, username, referralCode } = await request.json();

  try {
    let user = await User.findOne({ userId });

    if (user) {
      // Check if wallet details or referral code or current Quest is missing or invalid and update if needed
      if (!user.walletAddress || !Web3.utils.isAddress(user.walletAddress)) {
        const walletDetails = createWalletWithWeb3();
        Object.assign(user, walletDetails);
      }
      if (user.currentQuest === "" || user.currentQuest === null) {
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
        walletAddress: user.walletAddress,
        referralCode: user.referralCode,
      });
    }

    // User does not exist, create a new user with a wallet and referral code
   const walletDetails = createWalletWithWeb3();
   const hashedPrivateKey = await bcrypt.hash(
     walletDetails.privateKey,
     saltRounds
   );
   const newReferralCode = await generateAutoIncrementalReferralCode();

    // Fetch the first quest
    const firstQuest = await Quest.findOne({}).sort({ createdAt: 1 });

    user = new User({
      userId,
      username,
      points: 1000,
      playPass: 2,
      walletAddress: walletDetails.walletAddress,
      privateKey: hashedPrivateKey,
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

function createWalletWithWeb3() {
  const web3 = new Web3();
  const account = web3.eth.accounts.create();
  const walletDetails = {
    walletAddress: account.address,
    privateKey: account.privateKey,
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
