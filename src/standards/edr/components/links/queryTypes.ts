import { ExegesisContext } from "exegesis-express";
import edrCommonParams from "../params";
import * as types from "../../types";
import { matchCrsUriToProps } from "../helperScripts";

export const linkToQueryType = async (
  ctx: ExegesisContext,
  queryType: types.QueryType
) => {
  const _url = (await edrCommonParams(ctx))._url;
  _url.search = "";

  if (
    ctx.params.path.instanceId &&
    !_url.pathname.endsWith(ctx.params.path.instanceId)
  ) {
    _url.pathname = _url.pathname + `/${ctx.params.path.instanceId}`;
  } else if (
    ctx.params.path.collectionId &&
    !_url.pathname.endsWith(ctx.params.path.collectionId) &&
    !ctx.params.path.instanceId
  ) {
    _url.pathname = _url.pathname + `/${ctx.params.path.collectionId}`;
  }

  _url.pathname = _url.pathname + `/${queryType}`;
  return _url.toString();
};

const dataQuery = async ({
  ctx,
  query_type,
  crsStrings,
  default_output_format,
  output_formats,
  within_units,
  width_units,
  height_units,
}: {
  ctx: ExegesisContext;
  query_type: types.QueryType;
  crsStrings: string[];
  default_output_format: types.Default_output_format;
  output_formats: types.OutputFormats;
  within_units?: types.WithinUnits;
  height_units?: types.HeightUnits;
  width_units?: types.WidthUnits;
}): Promise<
  | types.RadiusDataQuery
  | types.AreaDataQuery
  | types.CubeDataQuery
  | types.CorridorDataQuery
  | types.PositionDataQuery
  | types.ItemsDataQuery
  | types.TrajectoryDataQuery
  | types.InstancesDataQuery
  | types.LocationsDataQuery
> => {
  if (query_type === "corridor") {
    if (!width_units || !height_units) {
      throw new Error(
        "Corridor Data Query: width_units or height_units must be provided"
      );
    }
  }
  if (query_type === "cube" && !height_units) {
    throw new Error("Cube Data Query: height_units must be provided");
  }
  if (query_type === "radius" && !within_units) {
    throw new Error("Radius Data Query: within_units must be provided");
  }
  return {
    link: {
      title: `${query_type.toLocaleUpperCase()} queryType`,
      href: await linkToQueryType(ctx, query_type),
      rel: query_type!=="items"&&query_type!=="locations"?"data":"items",
      templated: false,
      variables: {
        title: `${query_type.toLocaleUpperCase()} query`,
        description: `Query (meta)data of the select collection/instance via the ${query_type} query`,
        query_type,
        default_output_format,
        output_formats,
        crs_details: await matchCrsUriToProps(crsStrings),
        width_units: query_type === "corridor" ? width_units : undefined,
        height_units:
          query_type === "cube" || query_type === "corridor"
            ? height_units
            : undefined,
        within_units: query_type === "radius" ? within_units : undefined,
      },
    },
  };
};

export default dataQuery;
