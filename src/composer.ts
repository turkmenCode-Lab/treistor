import { Hil, HilMiddleware } from "./hil";

export type HilMiddleware = (hil: Hil, next: () => Promise<void>) => any;

export class Composer {
  private middlewares: HilMiddleware[] = [];

  use(mw: HilMiddleware) {
    this.middlewares.push(mw);
  }

  async execute(hil: Hil) {
    let index = 0;
    const runner = async () => {
      if (index < this.middlewares.length) {
        const mw = this.middlewares[index++];
        await mw(hil, runner);
      }
    };
    await runner();
  }
}
