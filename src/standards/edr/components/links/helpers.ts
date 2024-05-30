import { ExegesisContext } from "exegesis-express";
import * as types from "../../types";
import edrCommonParams from "../params";

export const filterAllowedContentTypes = async (
  ctx: ExegesisContext,
  allowedCNvals: types.ContentNegotiationArray
) => {
  return {
    //return an array with one object. Follows that a resource can have only one content-type val
    optionsForSelf: allowedCNvals
      .filter((obj) => obj.f === ctx.params.query.f)
      .slice(0, 1),
    //
    optionsForAlt: allowedCNvals.filter((obj) => obj.f !== ctx.params.query.f),
  };
};

export const appendLocation = async (
  ctx: ExegesisContext,
  location: string,
  cnVal: types.ContentNegotiationOption
) => {
  const { _url } = await edrCommonParams(ctx);
  _url.pathname = _url.pathname + location;
  _url.searchParams.set("f", cnVal.f);
  return _url.toString();
};
