import { Triestor } from "./triestor";

export class Hil {
  private update: any;
  private api: Triestor;

  constructor(update: any, api: Triestor) {
    this.update = update;
    this.api = api;
  }

  get update_id(): number {
    return this.update.update_id;
  }

  get message(): any {
    return this.update.message;
  }

  get callback_query(): any {
    return this.update.callback_query;
  }

  get inline_query(): any {
    return this.update.inline_query;
  }

  get chosen_inline_result(): any {
    return this.update.chosen_inline_result;
  }

  get chat(): any {
    return this.message?.chat || this.callback_query?.message?.chat;
  }

  get chatId(): number | string | undefined {
    return this.chat?.id;
  }

  get from(): any {
    return this.message?.from || this.callback_query?.from;
  }

  get user(): any {
    return this.from;
  }

  get text(): string | undefined {
    return this.message?.text;
  }

  get caption(): string | undefined {
    return this.message?.caption;
  }

  get photo(): any[] | undefined {
    return this.message?.photo;
  }

  get document(): any | undefined {
    return this.message?.document;
  }

  get reply_to_message(): any | undefined {
    return this.message?.reply_to_message;
  }

  get entities(): any[] | undefined {
    return this.message?.entities;
  }

  get data(): string | undefined {
    return this.callback_query?.data;
  }

  get message_id(): number | undefined {
    return this.message?.message_id || this.callback_query?.message?.message_id;
  }

  async reply(text: string, extra?: Record<string, any>) {
    if (!this.chatId) throw new Error("No chatId in update");
    return this.api.call("sendMessage", {
      chat_id: this.chatId,
      text,
      ...extra,
    });
  }

  async replyWithPhoto(photo: string, extra?: Record<string, any>) {
    if (!this.chatId) throw new Error("No chatId in update");
    const params = { chat_id: this.chatId, photo, ...extra };
    return this.api.call("sendPhoto", params);
  }

  async replyWithDocument(document: string, extra?: Record<string, any>) {
    if (!this.chatId) throw new Error("No chatId in update");
    const params = { chat_id: this.chatId, document, ...extra };
    return this.api.call("sendDocument", params);
  }

  async deleteMessage(messageId?: number) {
    if (!this.chatId) throw new Error("No chatId in update");
    const params = {
      chat_id: this.chatId,
      message_id: messageId || this.message_id,
    };
    return this.api.call("deleteMessage", params);
  }

  async editMessageText(text: string, extra?: Record<string, any>) {
    if (!this.chatId || !this.message_id)
      throw new Error("No chatId or message_id in update");
    const params = {
      chat_id: this.chatId,
      message_id: this.message_id,
      text,
      ...extra,
    };
    return this.api.call("editMessageText", params);
  }

  async answerCallbackQuery(text?: string, extra?: Record<string, any>) {
    if (!this.callback_query?.id)
      throw new Error("No callback_query id in update");
    const params = {
      callback_query_id: this.callback_query.id,
      text,
      ...extra,
    };
    return this.api.call("answerCallbackQuery", params);
  }

  get raw() {
    return this.update;
  }
}
