import { Triestor } from "./triestor";

export interface InlineKeyboardButton {
  text: string;
  callback_data?: string;
}

export interface InlineKeyboardMarkup {
  inline_keyboard: InlineKeyboardButton[][];
}

export interface ReplyKeyboardMarkup {
  keyboard: string[][];
  resize_keyboard?: boolean;
  one_time_keyboard?: boolean;
}

export interface ReplyKeyboardRemove {
  remove_keyboard: true;
  selective?: boolean;
}

export interface ForceReply {
  force_reply: true;
  input_field_placeholder?: string;
  selective?: boolean;
}

export type ReplyMarkup =
  | InlineKeyboardMarkup
  | ReplyKeyboardMarkup
  | ReplyKeyboardRemove
  | ForceReply;

export type ParseMode = "MarkdownV2" | "HTML" | "Markdown";

export interface SendMessageOptions {
  parse_mode?: ParseMode;
  entities?: any[];
  disable_web_page_preview?: boolean;
  disable_notification?: boolean;
  protect_content?: boolean;
  reply_markup?: ReplyMarkup;
  message_thread_id?: number;
  business_connection_id?: string;
  message_effect_id?: string;
}

export interface SendPhotoOptions {
  caption?: string;
  parse_mode?: ParseMode;
  caption_entities?: any[];
  has_spoiler?: boolean;
  disable_notification?: boolean;
  protect_content?: boolean;
  reply_markup?:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply;
  message_thread_id?: number;
  business_connection_id?: string;
  message_effect_id?: string;
}

export interface AnswerCallbackQueryOptions {
  text?: string;
  show_alert?: boolean;
  url?: string;
  cache_time?: number;
}

export class Hil {
  private update: any;
  private api: Triestor;

  constructor(update: any, api: Triestor) {
    this.update = update;
    this.api = api;
  }

  get chatId(): number | string | undefined {
    return (
      this.update?.message?.chat?.id ||
      this.update?.callback_query?.message?.chat?.id ||
      this.update?.inline_query?.from?.id ||
      undefined
    );
  }

  get messageId(): number | undefined {
    return (
      this.update?.message?.message_id ||
      this.update?.callback_query?.message?.message_id
    );
  }

  get text(): string | undefined {
    return this.update?.message?.text;
  }

  get user(): any | undefined {
    return (
      this.update?.message?.from ||
      this.update?.callback_query?.from ||
      this.update?.inline_query?.from
    );
  }

  get chat(): any | undefined {
    return (
      this.update?.message?.chat || this.update?.callback_query?.message?.chat
    );
  }

  get callbackQuery(): any | undefined {
    return this.update?.callback_query;
  }

  get inlineQuery(): any | undefined {
    return this.update?.inline_query;
  }

  get chosenInlineResult(): any | undefined {
    return this.update?.chosen_inline_result;
  }

  async reply(text: string, options?: SendMessageOptions) {
    if (!this.chatId) throw new Error("No chatId in update");
    return this.api.sendMessage(this.chatId, text, options);
  }

  async sendPhoto(photo: string | File, options?: SendPhotoOptions) {
    if (!this.chatId) throw new Error("No chatId in update");
    return this.api.sendPhoto(this.chatId, photo, options);
  }

  async sendDocument(document: string | File, options?: SendPhotoOptions) {
    if (!this.chatId) throw new Error("No chatId in update");
    return this.api.sendDocument(this.chatId, document, options);
  }

  async editMessageText(
    text: string,
    options?: SendMessageOptions & {
      message_id?: number;
      inline_message_id?: string;
    }
  ) {
    const messageId = options?.message_id || this.messageId;
    const opts = { ...options, message_id: messageId };
    delete opts.message_id;
    return this.api.editMessageText(this.chatId!, text, opts);
  }

  async deleteMessage(messageId?: number) {
    const id = messageId || this.messageId;
    if (!id) throw new Error("No messageId");
    return this.api.deleteMessage(this.chatId!, id);
  }

  async answerCbQuery(options?: AnswerCallbackQueryOptions) {
    if (!this.callbackQuery?.id) throw new Error("No callback_query id");
    return this.api.answerCallbackQuery(this.callbackQuery.id, options);
  }

  get raw() {
    return this.update;
  }
}
