import { Triestor } from "./triestor";

export class Hil {
  private update: any;
  private api: Triestor;

  constructor(update: any, api: Triestor) {
    this.update = update;
    this.api = api;
  }

  get chatId(): number | undefined {
    return this.update?.message?.chat?.id;
  }

  get username(): string | undefined {
    return this.update?.message?.chat?.username;
  }

  get first_name(): string | undefined {
    return this.update?.message?.chat?.first_name;
  }

  get last_name(): string | undefined {
    return this.update?.message?.chat?.first_name;
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
