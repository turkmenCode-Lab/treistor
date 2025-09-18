import { Triestor } from "./triestor";
import { Context } from "./context";

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("BOT_TOKEN is missing");

const bot = new Triestor(BOT_TOKEN);

async function main() {
  let offset: number | undefined;

  while (true) {
    const updates = await bot.getUpdates(offset);

    for (const update of updates) {
      const ctx = new Context(update, bot);

      if (ctx.text === "/start") {
        await ctx.reply("Welcome to Triestor 🚀");
      } else if (ctx.text) {
        await ctx.reply(`You said: ${ctx.text}`);
      }

      offset = update.update_id + 1;
    }
  }
}

main();
