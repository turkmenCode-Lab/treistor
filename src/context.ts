import { Triestor } from "./triestor";

export class Context {
  private update: any;
  private api: Triestor;

  constructor(update: any, api: Triestor) {
    this.update = update;
    this.api = api;
  }

  get chatId(): number | undefined {
    return this.update?.message?.chat?.id;
  }

  get text(): string | undefined {
    return this.update?.message?.text;
  }

  async reply(text: string) {
    if (!this.chatId) throw new Error("No chatId in update");
    return this.api.sendMessage(this.chatId, text);
  }

  get raw() {
    return this.update;
  }
}
