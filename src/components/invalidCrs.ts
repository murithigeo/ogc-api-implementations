import { ExegesisContext } from "exegesis-express";
import initCommonQueryParams from "../standards/features/components/params";

export default async function invalCrsRes(context: ExegesisContext) {
  const { bboxcrs_vArray, crs_vArray } = await initCommonQueryParams(context);
  if((bboxcrs_vArray||crs_vArray).length<1){
    return context.res.status(400)
  }
}
