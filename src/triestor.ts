import { Hil } from "./hil";
import { Composer, HilMiddleware } from "./composer";

export class Keyboard {
  private markup: any = {
    keyboard: [[]],
    resize_keyboard: false,
    one_time_keyboard: false,
  };

  text(text: string) {
    const lastRow = this.markup.keyboard[this.markup.keyboard.length - 1];
    lastRow.push({ text });
    return this;
  }

  row() {
    if (this.markup.keyboard[this.markup.keyboard.length - 1].length > 0) {
      this.markup.keyboard.push([]);
    }
    return this;
  }

  resized() {
    this.markup.resize_keyboard = true;
    return this;
  }

  oneTime() {
    this.markup.one_time_keyboard = true;
    return this;
  }

  toJSON() {
    // Filter out empty rows to prevent invalid keyboard structure
    const keyboard = this.markup.keyboard.filter(
      (row: any[]) => row.length > 0
    );
    if (keyboard.length === 0) {
      console.warn("Keyboard is empty, returning undefined reply_markup");
      return undefined;
    }
    return { reply_markup: { ...this.markup, keyboard } };
  }
}

export class InlineKeyboard {
  private markup: any = { inline_keyboard: [[]] };

  text(text: string, callbackData: string) {
    const lastRow =
      this.markup.inline_keyboard[this.markup.inline_keyboard.length - 1];
    lastRow.push({ text, callback_data: callbackData });
    return this;
  }

  row() {
    if (
      this.markup.inline_keyboard[this.markup.inline_keyboard.length - 1]
        .length > 0
    ) {
      this.markup.inline_keyboard.push([]);
    }
    return this;
  }

  url(text: string, url: string) {
    const lastRow =
      this.markup.inline_keyboard[this.markup.inline_keyboard.length - 1];
    lastRow.push({ text, url });
    return this;
  }

  toJSON() {
    const inline_keyboard = this.markup.inline_keyboard.filter(
      (row: any[]) => row.length > 0
    );
    if (inline_keyboard.length === 0) {
      console.warn(
        "Inline keyboard is empty, returning undefined reply_markup"
      );
      return undefined;
    }
    return { reply_markup: { ...this.markup, inline_keyboard } };
  }
}

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
    let body: any;
    let headers: any = {};

    const hasFile = Object.values(params).some(
      (v) =>
        v instanceof File ||
        (typeof v === "string" &&
          !v.startsWith("http") &&
          !v.startsWith("attach://"))
    );
    if (hasFile) {
      const form = new FormData();
      for (const [key, value] of Object.entries(params)) {
        form.append(key, value as any);
      }
      body = form;
    } else {
      body = JSON.stringify(params);
      headers = { "Content-Type": "application/json" };
    }

    console.log(`Sending API request: ${method}`, params);
    const res = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    const data = await res.json();
    if (!data.ok) {
      console.error(`API error in ${method}:`, data.description);
      throw new Error(data.description);
    }
    return data.result;
  }

  async sendMessage(
    chatId: number | string,
    text: string,
    extra?: Record<string, any>
  ) {
    return this.call("sendMessage", { chat_id: chatId, text, ...extra });
  }

  async sendPhoto(
    chatId: number | string,
    photo: string,
    extra?: Record<string, any>
  ) {
    return this.call("sendPhoto", { chat_id: chatId, photo, ...extra });
  }

  async sendDocument(
    chatId: number | string,
    document: string,
    extra?: Record<string, any>
  ) {
    return this.call("sendDocument", { chat_id: chatId, document, ...extra });
  }

  async deleteMessage(chatId: number | string, messageId: number) {
    return this.call("deleteMessage", {
      chat_id: chatId,
      message_id: messageId,
    });
  }

  async editMessageText(
    chatId: number | string,
    messageId: number,
    text: string,
    extra?: Record<string, any>
  ) {
    return this.call("editMessageText", {
      chat_id: chatId,
      message_id: messageId,
      text,
      ...extra,
    });
  }

  async answerCallbackQuery(
    callbackQueryId: string,
    extra?: Record<string, any>
  ) {
    return this.call("answerCallbackQuery", {
      callback_query_id: callbackQueryId,
      ...extra,
    });
  }

  async getUpdates(offset?: number, timeout = 30, allowedUpdates?: string[]) {
    return this.call("getUpdates", {
      offset,
      timeout,
      allowed_updates: allowedUpdates,
    });
  }

  async setWebhook(url: string, extra?: Record<string, any>) {
    return this.call("setWebhook", { url, ...extra });
  }

  async deleteWebhook() {
    return this.call("deleteWebhook");
  }

  async launch(allowedUpdates?: string[]) {
    let offset: number | undefined;

    while (true) {
      try {
        const updates = await this.getUpdates(
          offset,
          30,
          allowedUpdates || [
            "message",
            "callback_query",
            "inline_query",
            "chosen_inline_result",
          ]
        );

        for (const update of updates.result || updates) {
          const rawText = update.message?.text;
          const isCommand = rawText?.startsWith("/");
          const modifiedText = isCommand
            ? rawText.split(" ").slice(1).join(" ")
            : rawText;
          console.log("Processing update:", {
            update_id: update.update_id,
            rawText,
            modifiedText,
          });
          const hil = new Hil(update, this, modifiedText);
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
      const rawText = hil.message?.text;
      console.log("Checking command:", { cmd, rawText });
      if (rawText && rawText.startsWith(`/${cmd}`)) {
        console.log(`Command /${cmd} matched`);
        await handler(hil, next);
        return;
      }
      await next();
    });
  }

  hears(pattern: RegExp | string, handler: HilMiddleware) {
    const regex =
      typeof pattern === "string" ? new RegExp(pattern, "i") : pattern;
    this.use(async (hil, next) => {
      const text = hil.text || hil.caption;
      if (text && regex.test(text)) {
        console.log(`Hears pattern matched: ${text}`);
        await handler(hil, next);
      } else {
        await next();
      }
    });
  }

  on(
    type:
      | "message"
      | "callback_query"
      | "inline_query"
      | "chosen_inline_result"
      | string,
    handler: HilMiddleware
  ) {
    this.use(async (hil, next) => {
      if (hil[type as keyof Hil]) {
        console.log(`Event ${type} triggered`);
        await handler(hil, next);
      } else {
        await next();
      }
    });
  }
}
