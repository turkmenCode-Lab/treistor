export class TriestorAPI {
  private token: string;
  private apiUrl: string;

  constructor(token: string) {
    this.token = token;
    this.apiUrl = `https://api.telegram.org/bot${token}`;
  }
}
