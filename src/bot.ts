import { Composer, HilMiddleware } from "./composer";
import { Hil } from "./hil";
import { Triestor } from "./triestor";

export class Bot extends Composer {
  private api: Triestor;

  constructor(token: string) {
    super();
    this.api = new Triestor(token);
  }

  get botApi() {
    return this.api;
  }

  async launch() {
    let offset: number | undefined;

    while (true) {
      try {
        const updates = await this.api.getUpdates(offset);

        for (const update of updates) {
          const hil = new Hil(update, this.api);
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
      if (hil.text === `/${cmd}`) {
        await handler(hil, next);
      } else {
        await next();
      }
    });
  }

  hears(pattern: RegExp, handler: HilMiddleware) {
    this.use(async (hil, next) => {
      if (hil.text && pattern.test(hil.text)) {
        await handler(hil, next);
      } else {
        await next();
      }
    });
  }

  on(type: "message" | string, handler: HilMiddleware) {
    this.use(async (hil, next) => {
      if (type === "message" && hil.text) {
        await handler(hil, next);
      } else {
        await next();
      }
    });
  }
}
