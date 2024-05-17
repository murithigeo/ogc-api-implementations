import { ExegesisContext } from "exegesis-express";

async function edrQueryTrajectoryAtCollection(ctx: ExegesisContext) {
  ctx.res
    .status(200)
    .setBody(`Path: ${ctx.route.path}; Params: ${ctx.params.path}`);
}

async function edrQueryTrajectoryAtInstance(ctx: ExegesisContext) {
  ctx.res
    .status(200)
    .setBody(`Path: ${ctx.route.path}; Params: ${ctx.params.path}`);
}

export { edrQueryTrajectoryAtCollection, edrQueryTrajectoryAtInstance };
