import { ExegesisContext } from "exegesis-express";

async function edrGetAllItemsInCollection(ctx: ExegesisContext) {
  ctx.res
    .status(200)
    .setBody(
      `path: ${ctx.route.path}; Current params: ${ctx.params.path.collectionId}`
    );
}

async function edrGetOneItemInCollection(ctx: ExegesisContext) {
  ctx.res
    .status(200)
    .setBody(
      `path: ${ctx.route.path}; Current params: ${ctx.params.path.collectionId}`
    );
}

async function edrGetAllItemsInInstance(ctx: ExegesisContext) {
  ctx.res
    .status(200)
    .setBody(
      `path: ${ctx.route.path}; Current params: ${ctx.params.path.collectionId}`
    );
}

async function edrGetOneItemInInstance(ctx: ExegesisContext) {
  ctx.res
    .status(200)
    .setBody(
      `path: ${ctx.route.path}; Current params: ${ctx.params.path.collectionId}`
    );
}

export {
  edrGetAllItemsInCollection,
  edrGetAllItemsInInstance,
  edrGetOneItemInCollection,
  edrGetOneItemInInstance,
};
