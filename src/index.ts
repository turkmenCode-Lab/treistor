import "dotenv/config";

import { Triestor } from "./triestor";
import { Hil } from "./hil";
import { Composer } from "./composer";

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("BOT_TOKEN is missing");

const bot = new Triestor(BOT_TOKEN);
const composer = new Composer();

composer.use(async (hil, next) => {
  console.log("Received message:", hil.text);
  await next();
});

composer.use(async (hil, next) => {
  if (hil.text === "/start") {
    await hil.reply("Welcome to Triestor 🚀");
  } else if (hil.text) {
    await hil.reply(`You said: ${hil.text}`);
  }
  await next();
});

async function main() {
  let offset: number | undefined;

  while (true) {
    const updates = await bot.getUpdates(offset);

    for (const update of updates) {
      const hil = new Hil(update, bot);
      await composer.execute(hil);
      offset = update.update_id + 1;
    }
  }
}

main();
