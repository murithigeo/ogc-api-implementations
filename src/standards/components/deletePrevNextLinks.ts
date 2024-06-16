import { ExegesisContext } from "exegesis-express";
import { Link } from "../../types";
import edrCommonParams from "../components/params";

export default async function deletePrevNextLinks(
  ctx: ExegesisContext,
  links: Link[],
  count: number
) {
  const { limit, offset } = await edrCommonParams(ctx);
  const hasNextPage = offset + limit < count ? true : false;
  const hasPrevPage = offset > 0 ? true : false;

  return links.filter(
    (obj) =>
      (hasNextPage || obj.rel !== "next") && (hasPrevPage || obj.rel !== "prev")
  );
}
