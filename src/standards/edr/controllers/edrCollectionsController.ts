import { ExegesisContext } from "exegesis-express";
import sequelize from "../models";

/*
(async () => {
  sequelize.models.spatial_ref_sys
    .findAll({ raw: true, limit: 2 })
    .then((dbRes) => {
      console.log(dbRes);
    });
})();
*/
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
