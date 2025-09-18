import { Context } from "./hil";

export type Middleware = (ctx: Context, next: () => Promise<void>) => any;

export class Composer {
  private middlewares: Middleware[] = [];

  use(mw: Middleware) {
    this.middlewares.push(mw);
  }

  async execute(ctx: Context) {
    const runner = async (index: number): Promise<void> => {
      if (index < this.middlewares.length) {
        const mw = this.middlewares[index];
        await mw(ctx, () => runner(index + 1));
      }
    };

    await runner(0);
  }
}
