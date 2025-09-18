import "dotenv/config";

import { Triestor } from "./triestor";
import { Context } from "./context";
import { Composer } from "./composer";

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("BOT_TOKEN is missing");

const bot = new Triestor(BOT_TOKEN);

const composer = new Composer();

composer.use(async (ctx, next) => {
  console.log("Received message:", ctx.text);
  await next();
});

composer.use(async (ctx, next) => {
  if (ctx.text === "/start") {
    await ctx.reply("Welcome to Triestor 🚀");
  } else if (ctx.text) {
    await ctx.reply(`You said: ${ctx.text}`);
  }
  await next();
});

async function main() {
  let offset: number | undefined;

  while (true) {
    const updates = await bot.getUpdates(offset);

    for (const update of updates) {
      const ctx = new Context(update, bot);

      await composer.execute(ctx);

      offset = update.update_id + 1;
    }
  }
}

main();
