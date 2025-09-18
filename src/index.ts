import "dotenv/config";
import { Triestor, Keyboard } from "./triestor";

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("BOT_TOKEN is missing");

const bot = new Triestor(BOT_TOKEN);

bot.on("message", async (hil, next) => {
  console.log("Message received:", hil.message?.text || hil.message?.caption);
  await next();
});

bot.command("start", async (hil) => {
  console.log("Start command triggered for chat:", hil.chatId);
  const keyboard = new Keyboard()
    .text("Option 1")
    .text("Option 2")
    .row()
    .text("Option 3")
    .resized();
  await hil.reply("Welcome to Triestor 🚀", { reply_markup: keyboard });
});

bot.command("photo", async (hil) => {
  console.log("Photo command triggered");
  await hil.replyWithPhoto("https://example.com/photo.jpg", {
    caption: "A photo!",
  });
});

bot.hears(/hello/i, async (hil) => {
  console.log("Hears 'hello' triggered");
  await hil.reply("Hi there!");
});

bot.on("callback_query", async (hil) => {
  console.log("Callback query received:", hil.data);
  await hil.answerCallbackQuery("Clicked!");
  await hil.editMessageText("Updated text!");
});

bot.launch();
