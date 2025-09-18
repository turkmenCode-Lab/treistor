import {
  Hil,
  HilMiddleware,
  InlineKeyboardMarkup,
  ReplyMarkup,
  ParseMode,
  SendMessageOptions,
  SendPhotoOptions,
  AnswerCallbackQueryOptions,
} from "./hil";
import { Composer } from "./composer";

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

  async getMe() {
    return this.call("getMe");
  }

  async sendMessage(
    chatId: number | string,
    text: string,
    options?: SendMessageOptions
  ) {
    return this.call("sendMessage", { chat_id: chatId, text, ...options });
  }

  async forwardMessage(
    chatId: number | string,
    fromChatId: number | string,
    messageId: number,
    options?: {
      message_thread_id?: number;
      disable_notification?: boolean;
      protect_content?: boolean;
    }
  ) {
    return this.call("forwardMessage", {
      chat_id: chatId,
      from_chat_id: fromChatId,
      message_id: messageId,
      ...options,
    });
  }

  async copyMessage(
    chatId: number | string,
    fromChatId: number | string,
    messageId: number,
    options?: {
      message_thread_id?: number;
      caption?: string;
      parse_mode?: ParseMode;
      caption_entities?: any[];
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_markup?: InlineKeyboardMarkup;
    }
  ) {
    return this.call("copyMessage", {
      chat_id: chatId,
      from_chat_id: fromChatId,
      message_id: messageId,
      ...options,
    });
  }

  async sendPhoto(
    chatId: number | string,
    photo: string | File,
    options?: SendPhotoOptions
  ) {
    const params = {
      chat_id: chatId,
      photo: typeof photo === "string" ? photo : { ...photo },
      ...options,
    };
    if (photo instanceof File) {
      params.photo = photo;
    }
    return this.call("sendPhoto", params);
  }

  async sendAudio(
    chatId: number | string,
    audio: string | File,
    options?: SendPhotoOptions & {
      duration?: number;
      performer?: string;
      title?: string;
      thumbnail?: string | File;
    }
  ) {
    const params = {
      chat_id: chatId,
      audio: typeof audio === "string" ? audio : { ...audio },
      ...options,
    };
    if (audio instanceof File) {
      params.audio = audio;
    }
    return this.call("sendAudio", params);
  }

  async sendDocument(
    chatId: number | string,
    document: string | File,
    options?: SendPhotoOptions & { thumbnail?: string | File }
  ) {
    const params = {
      chat_id: chatId,
      document: typeof document === "string" ? document : { ...document },
      ...options,
    };
    if (document instanceof File) {
      params.document = document;
    }
    return this.call("sendDocument", params);
  }

  async sendVideo(
    chatId: number | string,
    video: string | File,
    options?: SendPhotoOptions & {
      duration?: number;
      width?: number;
      height?: number;
      supports_streaming?: boolean;
      thumbnail?: string | File;
    }
  ) {
    const params = {
      chat_id: chatId,
      video: typeof video === "string" ? video : { ...video },
      ...options,
    };
    if (video instanceof File) {
      params.video = video;
    }
    return this.call("sendVideo", params);
  }

  async sendAnimation(
    chatId: number | string,
    animation: string | File,
    options?: SendPhotoOptions & {
      duration?: number;
      width?: number;
      height?: number;
      thumbnail?: string | File;
    }
  ) {
    const params = {
      chat_id: chatId,
      animation: typeof animation === "string" ? animation : { ...animation },
      ...options,
    };
    if (animation instanceof File) {
      params.animation = animation;
    }
    return this.call("sendAnimation", params);
  }

  async sendVoice(
    chatId: number | string,
    voice: string | File,
    options?: SendPhotoOptions & {
      duration?: number;
      disable_notification?: boolean;
    }
  ) {
    const params = {
      chat_id: chatId,
      voice: typeof voice === "string" ? voice : { ...voice },
      ...options,
    };
    if (voice instanceof File) {
      params.voice = voice;
    }
    return this.call("sendVoice", params);
  }

  async sendVideoNote(
    chatId: number | string,
    video_note: string | File,
    options?: SendPhotoOptions & {
      duration?: number;
      length?: number;
      thumbnail?: string | File;
    }
  ) {
    const params = {
      chat_id: chatId,
      video_note:
        typeof video_note === "string" ? video_note : { ...video_note },
      ...options,
    };
    if (video_note instanceof File) {
      params.video_note = video_note;
    }
    return this.call("sendVideoNote", params);
  }

  async sendLocation(
    chatId: number | string,
    latitude: number,
    longitude: number,
    options?: {
      message_thread_id?: number;
      horizontal_accuracy?: number;
      live_period?: number;
      heading?: number;
      proximity_alert_radius?: number;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_markup?:
        | InlineKeyboardMarkup
        | ReplyKeyboardMarkup
        | ReplyKeyboardRemove
        | ForceReply;
    }
  ) {
    return this.call("sendLocation", {
      chat_id: chatId,
      latitude,
      longitude,
      ...options,
    });
  }

  async sendVenue(
    chatId: number | string,
    latitude: number,
    longitude: number,
    title: string,
    address: string,
    options?: {
      foursquare_id?: string;
      foursquare_type?: string;
      google_place_id?: string;
      google_place_type?: string;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_markup?:
        | InlineKeyboardMarkup
        | ReplyKeyboardMarkup
        | ReplyKeyboardRemove
        | ForceReply;
    }
  ) {
    return this.call("sendVenue", {
      chat_id: chatId,
      latitude,
      longitude,
      title,
      address,
      ...options,
    });
  }

  async sendContact(
    chatId: number | string,
    phoneNumber: string,
    firstName: string,
    options?: {
      last_name?: string;
      vcard?: string;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_markup?:
        | InlineKeyboardMarkup
        | ReplyKeyboardMarkup
        | ReplyKeyboardRemove
        | ForceReply;
    }
  ) {
    return this.call("sendContact", {
      chat_id: chatId,
      phone_number: phoneNumber,
      first_name: firstName,
      ...options,
    });
  }

  async sendPoll(
    chatId: number | string,
    question: string,
    options: string[],
    options?: {
      is_anonymous?: boolean;
      type?: string;
      allows_multiple_answers?: boolean;
      correct_option_id?: number;
      explanation?: string;
      explanation_parse_mode?: ParseMode;
      explanation_entities?: any[];
      open_period?: number;
      close_date?: number;
      is_closed?: boolean;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_markup?:
        | InlineKeyboardMarkup
        | ReplyKeyboardMarkup
        | ReplyKeyboardRemove
        | ForceReply;
    }
  ) {
    return this.call("sendPoll", {
      chat_id: chatId,
      question,
      options,
      ...options,
    });
  }

  async sendDice(
    chatId: number | string,
    options?: {
      emoji?: string;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_markup?:
        | InlineKeyboardMarkup
        | ReplyKeyboardMarkup
        | ReplyKeyboardRemove
        | ForceReply;
    }
  ) {
    return this.call("sendDice", { chat_id: chatId, ...options });
  }

  async sendChatAction(
    chatId: number | string,
    action:
      | "typing"
      | "upload_photo"
      | "record_video"
      | "upload_video"
      | "record_voice"
      | "upload_audio"
      | "upload_document"
      | "find_location"
      | "record_video_note"
      | "upload_video_note"
  ) {
    return this.call("sendChatAction", { chat_id: chatId, action });
  }

  async editMessageText(
    chatId: number | string | undefined,
    text: string,
    options?: SendMessageOptions & {
      message_id?: number;
      inline_message_id?: string;
    }
  ) {
    return this.call("editMessageText", { chat_id: chatId, text, ...options });
  }

  async deleteMessage(chatId: number | string, messageId: number) {
    return this.call("deleteMessage", {
      chat_id: chatId,
      message_id: messageId,
    });
  }

  async answerCallbackQuery(
    callbackQueryId: string,
    options?: AnswerCallbackQueryOptions
  ) {
    return this.call("answerCallbackQuery", {
      callback_query_id: callbackQueryId,
      ...options,
    });
  }

  async getUpdates(
    offset?: number,
    limit = 100,
    timeout = 30,
    allowedUpdates?: string[]
  ) {
    return this.call("getUpdates", {
      offset,
      limit,
      timeout,
      allowed_updates: allowedUpdates,
    });
  }

  async setWebhook(
    url: string,
    options?: {
      certificate?: File;
      ip_address?: string;
      max_connections?: number;
      allowed_updates?: string[];
      drop_pending_updates?: boolean;
      secret_token?: string;
    }
  ) {
    return this.call("setWebhook", { url, ...options });
  }

  async deleteWebhook(dropPendingUpdates?: boolean) {
    return this.call("deleteWebhook", {
      drop_pending_updates: dropPendingUpdates,
    });
  }

  async getWebhookInfo() {
    return this.call("getWebhookInfo");
  }

  async launch(polling = true) {
    if (!polling) {
      console.log("Webhook mode: Set webhook manually using setWebhook");
      return;
    }

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

  command(cmd: string, handler: (hil: Hil) => any) {
    this.use(async (hil, next) => {
      if (hil.text && hil.text.startsWith(`/${cmd}`)) {
        await handler(hil);
      } else {
        await next();
      }
    });
  }

  hears(pattern: RegExp | string, handler: (hil: Hil) => any) {
    this.use(async (hil, next) => {
      const testPattern =
        typeof pattern === "string" ? new RegExp(pattern) : pattern;
      if (hil.text && testPattern.test(hil.text)) {
        await handler(hil);
      } else {
        await next();
      }
    });
  }

  on(type: string, handler: (hil: Hil) => any) {
    this.use(async (hil, next) => {
      if (hil.raw[type]) {
        await handler(hil);
      } else {
        await next();
      }
    });
  }
}
