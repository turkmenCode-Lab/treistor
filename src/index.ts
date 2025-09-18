import { Triestor } from "./triestor";

const BOT_TOKEN: string = process.env.BOT_TOKEN;

const bot = new Triestor(BOT_TOKEN);

async function main() {
  const updates = await bot.getUpdates();
  console.log("Updates:", updates);

  if (updates.length > 0) {
    const chatId = updates[0].message.chat.id;
    await bot.sendMessage(chatId, "Hello from Triestor 🚀");
  }
}

main();
