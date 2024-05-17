import { ExegesisContext } from "exegesis-express";

async function edrQueryLocationsAtCollection_All(ctx: ExegesisContext) {
  ctx.res
    .status(200)
    .setBody(`Path: ${ctx.route.path}; Params: ${ctx.params.path}`);
}

async function edrQueryLocationsAtInstance_All(ctx: ExegesisContext) {
  ctx.res
    .status(200)
    .setBody(`Path: ${ctx.route.path}; Params: ${ctx.params.path}`);
}

async function edrQueryLocationsAtCollection_One(ctx: ExegesisContext) {
  ctx.res
    .status(200)
    .setBody(`Path: ${ctx.route.path}; Params: ${ctx.params.path}`);
}

async function edrQueryLocationsAtInstance_One(ctx: ExegesisContext) {
  ctx.res
    .status(200)
    .setBody(`Path: ${ctx.route.path}; Params: ${ctx.params.path}`);
}

export {
  edrQueryLocationsAtCollection_All,
  edrQueryLocationsAtInstance_One,
  edrQueryLocationsAtCollection_One,
  edrQueryLocationsAtInstance_All,
};
