import { Hil } from "./hil";

export type HilMiddleware = (hil: Hil, next: () => Promise<void>) => any;

export class Composer {
  private middlewares: HilMiddleware[] = [];

  use(mw: HilMiddleware) {
    this.middlewares.push(mw);
  }

  async execute(hil: Hil) {
    const runner = async (index: number): Promise<void> => {
      if (index < this.middlewares.length) {
        const mw = this.middlewares[index];
        await mw(hil, () => runner(index + 1));
      }
    };

    await runner(0);
  }
}
