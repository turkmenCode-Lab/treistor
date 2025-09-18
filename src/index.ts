import { Triestor } from "./triestor";

const bot = new Triestor("YOUR_BOT_TOKEN_HERE");

async function main() {
  const updates = await bot.getUpdates();
  console.log("Updates:", updates);

  if (updates.length > 0) {
    const chatId = updates[0].message.chat.id;
    await bot.sendMessage(chatId, "Hello from Triestor 🚀");
  }
}

main();
