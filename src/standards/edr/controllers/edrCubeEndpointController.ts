import { ExegesisContext } from "exegesis-express";

async function edrQueryCubeAtCollection(ctx: ExegesisContext) {
  ctx.res
    .status(200)
    .setBody(`Path: ${ctx.route.path}; Params: ${ctx.params.path}`);
}

async function edrQueryCubeAtInstance(ctx: ExegesisContext) {
  ctx.res
    .status(200)
    .setBody(`Path: ${ctx.route.path}; Params: ${ctx.params.path}`);
}

export { edrQueryCubeAtCollection, edrQueryCubeAtInstance };
