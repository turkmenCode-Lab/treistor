import { Triestor } from "./triestor";
import { Composer, HilMiddleware } from "./composer";
import { Hil } from "./hil";

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
        console.error("Error in polling loop:", err);
        await new Promise((res) => setTimeout(res, 1000));
      }
    }
  }
}
