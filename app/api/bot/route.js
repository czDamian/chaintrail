//api/bot/route.js
const { Telegraf, Markup } = require("telegraf");
const fetch = require("node-fetch");
require('dotenv').config(); // Load environment variables from .env file

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error("BOT_TOKEN is required!");
}

const bot = new Telegraf(token);

bot.start((ctx) => {
  //   console.log("Bot started by:", ctx.from.username);
  //   console.log(ctx.update);
  const query = ` Welcome to ChainTrail Bot. Type /launch to start the game or /points to view your points or /pass to view your number of play pass left. Have Fun`;
  ctx.reply(query);

  //   ctx.telegram.sendMessage(ctx.chat.id, "Launch the game");
});
bot.command("launch", async (ctx) => {
  const startGameText = "Click the link below to start playing the game";
  const webAppUrl = "https://chaintrail.vercel.app/";
  ctx.reply(
    startGameText,
    Markup.inlineKeyboard([Markup.button.webApp("Play", webAppUrl)])
  );
});

// Command to get and reply with the user's points
bot.command("points", async (ctx) => {
  const userId = ctx.from.id; // Get the Telegram user ID of the sender
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
// Command to get and reply with the user's points
bot.command("pass", async (ctx) => {
  const userId = ctx.from.id; // Get the Telegram user ID of the sender
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
bot.launch();
