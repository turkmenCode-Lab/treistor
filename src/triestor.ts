export class Triestor {
  private token: string;
  private apiUrl: string;

  constructor(token: string) {
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
}
