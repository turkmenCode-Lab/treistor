import { Hil } from "./hil";
import { Composer, HilMiddleware } from "./composer";

export class Triestor extends Composer {
  private token: string;
  private apiUrl: string;

  constructor(token: string) {
    super();
    this.token = token;
    this.apiUrl = `https://api.telegram.org/bot${token}`;
  }

  async call<T = any>(
    method: string,
    params: Record<string, any> = {}
  ): Promise<T> {
    const url = `${this.apiUrl}/${method}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    const data = await res.json();
    if (!data.ok) throw new Error(data.description);
    return data.result;
  }

  async sendMessage(chatId: number | string, text: string) {
    return this.call("sendMessage", { chat_id: chatId, text });
  }

  async getUpdates(offset?: number, timeout = 30) {
    return this.call("getUpdates", { offset, timeout });
  }

  async launch() {
    let offset: number | undefined;

    while (true) {
      try {
        const updates = await this.getUpdates(offset);

        for (const update of updates) {
          const hil = new Hil(update, this);
          await this.execute(hil);
          offset = update.update_id + 1;
        }
      } catch (err) {
        console.error("Polling error:", err);
        await new Promise((res) => setTimeout(res, 1000));
      }
    }
  }

  command(cmd: string, handler: HilMiddleware) {
    this.use(async (hil, next) => {
      if (hil.text === `/${cmd}`) await handler(hil, next);
      else await next();
    });
  }

  hears(pattern: RegExp, handler: HilMiddleware) {
    this.use(async (hil, next) => {
      if (hil.text && pattern.test(hil.text)) await handler(hil, next);
      else await next();
    });
  }

  on(type: "message" | string, handler: HilMiddleware) {
    this.use(async (hil, next) => {
      if (type === "message" && hil.text) await handler(hil, next);
      else await next();
    });
  }
}
