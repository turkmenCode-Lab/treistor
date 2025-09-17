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
