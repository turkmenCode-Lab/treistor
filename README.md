                ┌────────────────────┐
                │  Telegram Servers  │
                └───────▲────────────┘
                        │
        ┌───────────────┼───────────────┐
        │ Polling (getUpdates)          │
        │ Webhook (HTTP POST /update)   │
        └───────────────┼───────────────┘
                        │
                 ┌──────▼──────┐
                 │  Bot Core   │
                 └──────▲──────┘
                        │
             ┌──────────┴──────────┐
             │ Update Dispatcher   │
             └──────────▲──────────┘
                        │
                 ┌──────┴──────┐
                 │ Middleware   │  ← chain of functions
                 └──────▲──────┘
                        │
                 ┌──────┴──────┐
                 │  Context     │  ← wraps update + helpers
                 └──────▲──────┘
                        │
                 ┌──────┴──────┐
                 │ Telegram API │  ← HTTP client
                 └──────────────┘

📝 TASKS.md — Build My Own Bot Framework Core
✅ Phase 1: Setup Project

Init npm project (npm init -y)

Add TypeScript (npm install typescript @types/node --save-dev)

Create src/ folder

Add tsconfig.json

💡 Clue: Keep the project minimal — no need for extras until the core works.

✅ Phase 2: Telegram API Client

Create src/telegram.ts

Implement a generic call(method, params) function using fetch or axios

Implement helper methods:

sendMessage(chatId, text)

getUpdates(offset, timeout)

💡 Clue: Look at Telegram Bot API docs → https://core.telegram.org/bots/api
.

✅ Phase 3: Context System

Create src/context.ts

Wrap raw update into a Context class

Add helper methods:

ctx.chatId → shortcut to update.message.chat.id

ctx.reply(text) → calls sendMessage

💡 Clue: Think: how can developers avoid writing raw API calls every time?

✅ Phase 4: Middleware System

Create src/composer.ts

Implement use(middleware) to register functions

Middleware signature: (ctx, next) => { … }

Make sure next() calls the next middleware in the chain

💡 Clue: It’s like Express.js middlewares but for Telegram updates.

✅ Phase 5: Bot Core

Create src/bot.ts

Extend Composer so Bot can also use middlewares

Implement launch() with polling:

Call getUpdates in a loop

For each update:

Create a Context

Pass it through the middleware chain

💡 Clue: The Bot is just a dispatcher + middleware runner.

✅ Phase 6: Sugar Syntax (Developer API)

Add bot.command("start", handler)

Add bot.hears(/regex/, handler)

Add bot.on("message", handler)

💡 Clue: These are just filters that wrap into middleware.

✅ Phase 7: Optional Improvements

Add Webhook support

Add Error handling middleware

Add Session management (in-memory first, then DB)

Add Custom context extensions (like ctx.user, ctx.session)

💡 Clue: Don’t add all at once. Grow features as you need them.

✅ Final Goal

Create a working bot like this:

import { Bot } from "my-bot-core";

const bot = new Bot("TOKEN");

bot.command("start", (ctx) => ctx.reply("Hello! 🚀"));
bot.hears(/hi/i, (ctx) => ctx.reply("Hey there!"));
bot.launch();

If this runs → you’ve successfully built your own Telegraf-like core. 🎉
