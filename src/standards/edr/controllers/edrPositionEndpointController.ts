import { ExegesisContext } from "exegesis-express";

async function edrQueryPositionAtCollection(ctx: ExegesisContext) {
  ctx.res
    .status(200)
    .setBody(`Path: ${ctx.route.path}; Params: ${ctx.params.path}`);
}

async function edrQueryPositionAtInstance(ctx: ExegesisContext) {
  ctx.res
    .status(200)
    .setBody(`Path: ${ctx.route.path}; Params: ${ctx.params.path}`);
}

export { edrQueryPositionAtCollection, edrQueryPositionAtInstance };
