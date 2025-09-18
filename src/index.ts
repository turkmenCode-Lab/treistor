import "dotenv/config";
import { Bot } from "./bot";

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("BOT_TOKEN is missing");

const bot = new Bot(BOT_TOKEN);

bot.use(async (hil, next) => {
  console.log("Received message:", hil.text);
  await next();
});

bot.use(async (hil, next) => {
  if (hil.text === "/start") {
    await hil.reply("Welcome to Triestor 🚀");
  } else if (hil.text) {
    await hil.reply(`You said: ${hil.text}`);
  }
  await next();
});

// Start polling
bot.launch();
