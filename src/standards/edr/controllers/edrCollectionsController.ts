import { ExegesisContext } from "exegesis-express";
import sequelize from "../models";
import getPostGisVersion from "../models/scripts/postgis_version";
import * as types from "../types";
import { genCollectionInfo } from "../components/genJsonDocs.ts/collections";
import convertJsonToYAML from "../../features/components/convertToYaml";
import makeQueryValidationError from "../../components/makeValidationError";
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
  console.log(3.5 < (await getPostGisVersion(sequelize)));
  ctx.res.status(200).setBody("This is the {root}/collections ep");
}

async function edrGetOneCollection(ctx: ExegesisContext) {
  const collection: types.Collection = await genCollectionInfo(ctx, {
    id: "hourly",
    modelName: "hourly2024",
    datetimeColumns: [],
    edrVariables: [
      {
        id: "temperature",
        dataType: "float",
        name: "temperature",
        unit: "temperature"
      },
      {
        id: "pressure",
        dataType: "float",
        name:"pressureMsl",
        unit: "pressure"
      }
    ],
    allSupportedCrs: [],
    output_formats: [],
    default_output_format: "",
    data_queries: {},
  });

  switch (ctx.params.query.f) {
    case "json":
      ctx.res.status(200).json(collection);
      break;
    case "yaml":
      ctx.res
        .status(200)
        .set("content-type", "text/yaml")
        .setBody(await convertJsonToYAML(collection));
      break;
    default:
      ctx.res.status(400).json(await makeQueryValidationError(ctx, "f"));
  }
}

export { edrGetCollectionsRoot, edrGetOneCollection };
