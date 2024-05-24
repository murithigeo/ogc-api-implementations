import { ExegesisContext } from "exegesis-express";
import * as types from "../../types";
import edrCommonParams from "../params";
import * as linksGenerators from "./collections_instances";

export async function radius(
  ctx: ExegesisContext,
  collectionOrInstanceId: string
): Promise<types.RadiusDataQuery> {
  let href: string = "";
  if (ctx.params.path.collectionId || ctx.params.path.instanceId) {
    href = await linksGenerators.linkToQueryType_specificId(ctx, "radius");
  } else {
    href = await linksGenerators.linkToQueryType_Root(
      ctx,
      collectionOrInstanceId,
      "area"
    );
  }

  return {
    link: {
      href,
      title: "Radius Query Endpoint",
      rel: "",
      variables: {
        title: "Radius Query",
        description: "Query the collection or Instance using a radius Query",
        crs_details: [],
        default_output_format: "",
        output_formats: [],
        within_units: [],
        query_type: "radius",
      },
    },
  };
}
