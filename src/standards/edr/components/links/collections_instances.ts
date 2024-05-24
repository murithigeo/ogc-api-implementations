import { ExegesisContext } from "exegesis-express";
import edrCommonParams from "../params";
import * as types from "../../types";

export const linkToQueryType_Root = async (
  ctx: ExegesisContext,
  collectionOrInstanceId: string,
  queryType: types.QueryType
) => {
  const _url = (await edrCommonParams(ctx))._url;
  _url.search = "";
  _url.pathname = _url.pathname + `/${collectionOrInstanceId}/${queryType}`;
  return _url.toString();
};

export const linkToQueryType_specificId = async (
  ctx: ExegesisContext,
  queryType: types.QueryType
) => {
  const _url = (await edrCommonParams(ctx))._url;
  _url.search = "";
  _url.pathname = _url.pathname + `/${queryType}`;
  return _url.toString();
};

//async function

