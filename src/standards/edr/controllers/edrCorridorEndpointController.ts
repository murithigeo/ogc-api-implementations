import { ExegesisContext } from "exegesis-express";

async function edrQueryCorridorAtCollection(ctx: ExegesisContext) {
  ctx.res
    .status(200)
    .setBody(`Path: ${ctx.route.path}; Params: ${ctx.params.path}`);
}

async function edrQueryCorridorAtInstance(ctx: ExegesisContext) {
  ctx.res
    .status(200)
    .setBody(`Path: ${ctx.route.path}; Params: ${ctx.params.path}`);
}

export { edrQueryCorridorAtInstance, edrQueryCorridorAtCollection };
