import { ExegesisContext } from "exegesis-express";

async function edrQueryAreaAtCollection(ctx: ExegesisContext) {
  ctx.res
    .status(200)
    .setBody(`Path: ${ctx.route.path}; Params: ${ctx.params.path}`);
}

async function edrQueryAreaAtInstance(ctx: ExegesisContext) {
  ctx.res
    .status(200)
    .setBody(`Path: ${ctx.route.path}; Params: ${ctx.params.path}`);
}

export { edrQueryAreaAtCollection, edrQueryAreaAtInstance };
