import "dotenv/config";
import { Triestor } from "./triestor";

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("BOT_TOKEN is missing");

const bot = new Triestor(BOT_TOKEN);

bot.on("message", async (hil, next) => {
  console.log("Message received:", hil.text);
  await next();
});

bot.command("start", async (hil) => {
  await hil.reply("Welcome to Triestor 🚀");
});

bot.hears(/hello/i, async (hil) => {
  await hil.reply("Hi there!");
});

bot.launch();
