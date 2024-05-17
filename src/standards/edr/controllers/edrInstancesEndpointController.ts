import { ExegesisContext } from "exegesis-express";

async function edrGetAllInstancesInCollection(ctx: ExegesisContext) {
  ctx.res
    .status(200)
    .setBody(
      `Endpoint for {root}/${ctx.route.path}; collectionId= ${ctx.params.path.collectionId}`
    );
}

async function edrGetOneInstanceInCollection(ctx: ExegesisContext) {
  ctx.res
    .status(200)
    .setBody(
      `Endpoint for {root}/${ctx.route.path}; collectionId= ${ctx.params.path.collectionId}; instanceId=${ctx.params.path.instanceId}`
    );
}

export { edrGetOneInstanceInCollection, edrGetAllInstancesInCollection };
