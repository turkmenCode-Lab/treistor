export class TriestorAPI {
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
}
