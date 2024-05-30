import { ExegesisContext } from "exegesis-express";
import edrCommonParams from "../params";

const edrQueryEndpointLink = async (
  ctx: ExegesisContext,
  locationId: string
) => {
  //Assumes that _url= http://domainName/collections/{collectionId}/{instances}/locations/{locationId}
  //or http://domainName/collections/{collectionId}/{queryType}/cube?bbbb.....
  //Should return http://domainName/collections/{collectionId/locations/{locationId}
  const { _url } = await edrCommonParams(ctx);
  const link = encodeURI(
    `${ctx.api.serverObject.url}/collections/${
      ctx.params.path.instanceId
        ? ctx.params.path.collectionId +
          "/instances/" +
          ctx.params.path.instanceId +
          "/locations/" +
          locationId
        : ctx.params.path.collectionId + "/locations/" + locationId
    }`
  );
  return link;
};

export default edrQueryEndpointLink;
