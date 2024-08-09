import { NextResponse } from "next/server";
import { Telegraf, Markup } from "telegraf";
import fetch from "node-fetch";

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error("BOT_TOKEN is required!");
}

const bot = new Telegraf(token);

bot.start((ctx) => {
  const query = `Welcome to ChainTrail Bot. Type /launch to start the game or /points to view your points or /pass to view your number of play pass left. Have Fun`;
  ctx.reply(query);
});

bot.command("launch", async (ctx) => {
  const startGameText = "Click the link below to start playing the game";
  const webAppUrl = "https://chaintrail.vercel.app/";
  ctx.reply(
    startGameText,
    Markup.inlineKeyboard([Markup.button.webApp("Play", webAppUrl)])
  );
});

bot.command("points", async (ctx) => {
  const userId = ctx.from.id;
  const apiUrl = `https://chaintrail.vercel.app/api/users?userId=${userId}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch user points");
    }

    const data = await response.json();
    const points = data.points;

    ctx.reply(`You have ${points} points.`);
  } catch (error) {
    ctx.reply("Sorry, there was an error fetching your points.");
    console.error(error);
  }
});

bot.command("pass", async (ctx) => {
  const userId = ctx.from.id;
  const apiUrl = `https://chaintrail.vercel.app/api/users?userId=${userId}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch user points");
    }

    const data = await response.json();
    const pass = data.playPass;

    ctx.reply(`You have ${pass} Play Pass left.`);
  } catch (error) {
    ctx.reply("Sorry, there was an error fetching your points.");
    console.error(error);
  }
});

export async function GET() {
  return NextResponse.json({ ok: true, message: "Bot webhook is active" });
}

export async function POST(request) {
  try {
    const data = await request.json(); // Correctly parse JSON from the request body

    await bot.handleUpdate(data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error processing update:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
