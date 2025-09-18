import "dotenv/config";
import { Triestor } from "./triestor";
import { Hil } from "./hil";

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("BOT_TOKEN is missing");

const bot = new Triestor(BOT_TOKEN);

bot.on("message", async (hil: Hil) => {
  console.log("Message received:", hil.text);
});

bot.command("start", async (hil: Hil) => {
  await hil.reply("Welcome to Triestor 🚀");
});

bot.hears(/hello/i, async (hil: Hil) => {
  await hil.reply("Hi there!");
});

bot.on("callback_query", async (hil: Hil) => {
  await hil.answerCbQuery({ text: "Button clicked!" });
});

bot.launch();
