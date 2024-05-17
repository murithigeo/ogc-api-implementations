import { ExegesisContext } from "exegesis-express";

async function edrGetCollectionsRoot(ctx: ExegesisContext) {
  ctx.res.status(200).setBody("This is the {root}/collections ep");
}

async function edrGetOneCollection(ctx: ExegesisContext) {
  ctx.res
    .status(200)
    .setBody(
      "This is the {root}/collections/{collectionId} ep: " +
        ctx.params.path.collectionId
    );
}

export { edrGetCollectionsRoot, edrGetOneCollection };
