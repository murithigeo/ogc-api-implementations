import { ExegesisContext } from "exegesis-express";
import { URL, URLSearchParams, Url } from "url";
import { F_AssociatedType, Link } from "../../../types";
import initCommonQueryParams from "./params";

async function filter_f_types(
  ctx: ExegesisContext,
  allowed_f_values: F_AssociatedType[]
): Promise<{
  optionsForSelf: F_AssociatedType[];
  optionsForAlt: F_AssociatedType[];
}> {
  const { f } = await initCommonQueryParams(ctx);
  /**
   * Given that a web resource can only have one Content-Type header, return only the first element of @optionsForSelf
   */
  const optionsForSelf = allowed_f_values
    .filter((obj) => obj.f === f)
    .slice(0, 1);

  const optionsForAlt = allowed_f_values.filter((obj) => obj.f !== f);
  return { optionsForSelf, optionsForAlt };
}

/**
 *
 * @param ctx
 * @param mode
 */
async function genLinksAll(
  ctx: ExegesisContext,
  allowed_f_values: F_AssociatedType[],
  mode:
    | "Feature"
    | "collectionsRoot"
    | "Collection"
    | "Conformance"
    | "Items"
    | "Root"
) {
  //Link to current endpoint. It has query parameters
  const { urlToThisEP } = await initCommonQueryParams(ctx);

  /**
   * optionsforSelf &optionsforAlt
   */
  (async () => {
    mode === "Collection" ||
    mode === "Conformance" ||
    mode === "Root" ||
    mode === "collectionsRoot"
      ? allowed_f_values.forEach((element) => {
          if (element.f === "json") {
            element.type = "application/json";
          }
        })
      : allowed_f_values.forEach((element) => {
          if (element.f === "json") {
            element.type = "application/geo+json";
          }
        });
  })();

  const { optionsForSelf, optionsForAlt } = await filter_f_types(
    ctx,
    allowed_f_values
  );

  /**
   * @const links
   */
  const links: Link[] = [];

  /**
   * @Link rel=self& alt
   */

  for (const option of optionsForSelf) {
    //Mutate type to application/geo+json if f=json
    let _tempLink = new URL(urlToThisEP);
    _tempLink.searchParams.set("f", option.f);
    links.push({
      rel: "self",
      href: _tempLink.toString(),
      title: `This document as ${option.f}`,
      type: option.type,
    });
  }

  for (const option of optionsForAlt) {
    let _tempLink = new URL(urlToThisEP);
    _tempLink.searchParams.set("f", option.f);
    links.push({
      rel: "alternate",
      href: _tempLink.toString(),
      title: `View this document as ${option.f}`,
      type: option.type,
    });
  }

  //Endpoint dependent links

  switch (mode) {
    case "Root":
      for (const option of allowed_f_values) {
        //Current link : http://serverUrl/features/
        //conformance
        var _tempLink = new URL(urlToThisEP.href);
        _tempLink.pathname = _tempLink.pathname + "conformance";
        _tempLink.searchParams.set("f", option.f);
        links.push({
          rel: "conformance",
          href: _tempLink.toString(),
          type: option.type,
          title: `View the conformance document as ${option.f}`,
        });
        //links to collection (rel=data)
        var _tempLink = new URL(urlToThisEP.href);
        _tempLink.pathname = _tempLink.pathname + "collections";
        _tempLink.searchParams.set("f", option.f);
        links.push({
          rel: "data",
          href: _tempLink.toString(),
          title: `View the collections as ${option.f}`,
          type: option.type,
        });
      }

      //Non dynamic routes (/api&/api.html)
      var _tempLink = new URL(urlToThisEP.href);
      _tempLink.pathname = _tempLink.pathname + "api";
      _tempLink.search = "";
      links.push({
        rel: "service-desc",
        href: _tempLink.toString(),
        title: `View the OpenApi Description Document`,
        type: "application/vnd.oai.openapi+json;version=3.0",
      });

      var _tempLink = new URL(urlToThisEP.href);
      _tempLink.pathname = _tempLink.pathname + "api.html";
      _tempLink.search = "";
      links.push({
        rel: "service-doc",
        href: _tempLink.toString(),
        title: `View the OpenApi Description document as an interactive Web Console`,
        type: "text/html",
      });
      break;
    case "Collection":
      for (let option of allowed_f_values) {
        (async () => {
          if (option.f === "json") {
            option.type = "application/geo+json";
          }
        })();
        var _tempLink = new URL(urlToThisEP);
        _tempLink.search = "";
        _tempLink.pathname = _tempLink.pathname + "/items";
        _tempLink.searchParams.set("f", option.f);

        links.push({
          href: _tempLink.toString(),
          title: `View the items in this collection as ${option.f}`,
          type: option.type,
          rel: "items",
        });
      }
      break;
    case "Conformance":
      //No code because it does not require other links
      break;
    case "collectionsRoot":
      //No code because it does not require other links
      break;
    case "Items":
      //Prev and next links
      for (let option of optionsForSelf) {
        //uses the original link
        const { nextPageOffset, prevPageOffset } = await initCommonQueryParams(
          ctx
        );
        option = await changeLinkTypeForNestLinks(
          option,
          "json",
          "application/geo+json"
        );
        var _tempLink = new URL(urlToThisEP);
        _tempLink.searchParams.set("offset", nextPageOffset.toString());
        links.push({
          rel: "next",
          title: `View the next page of results as ${option.f}`,
          type: option.type,
          href: _tempLink.toString(),
        });

        _tempLink.searchParams.set("offset", prevPageOffset.toString());
        links.push({
          rel: "prev",
          title: `View the previous page of results as ${option.f}`,
          type: option.type,
          href: _tempLink.toString(),
        });
      }
      //urlToThisEP=http://serverUrl/features/{collectionId}/items
      //URL to /features/collections/collectionId

      for (let option of allowed_f_values) {
        var _tempLink = new URL(urlToThisEP);
        _tempLink = new URL(new URL("..", _tempLink).toString().slice(0, -1));

        _tempLink.searchParams.set("f", option.f);
        option = await changeLinkTypeForNestLinks(
          option,
          "json",
          "application/json"
        );
        links.push({
          rel: "collection",
          type: option.type,
          href: _tempLink.toString(),
          title: `View the collection document as ${option.f}`,
        });
      }
      break;
    case "Feature":
      //Provide links to /features/{collectionId} && /features/{collectionId}/items
      for (let option of allowed_f_values) {
        var _tempLink = new URL(urlToThisEP);
        _tempLink.search = "";
        _tempLink = new URL(
          new URL("../../", _tempLink).toString().slice(0, -1)
        );
        option = await changeLinkTypeForNestLinks(
          option,
          "json",
          "application/json"
        );
        _tempLink.searchParams.set("f", option.f);
        links.push({
          rel: "collection",
          href: _tempLink.toString(),
          title: `View the collection doc`,
          type: option.type,
        });

        option = await changeLinkTypeForNestLinks(
          option,
          "json",
          "application/geo+json"
        );
        var _tempLink = new URL(urlToThisEP);
        _tempLink.search = "";
        _tempLink = new URL(new URL("./", _tempLink).toString().slice(0, -1));
        _tempLink.searchParams.set("f", option.f);
        links.push({
          rel: "items",
          href: _tempLink.toString(),
          title: `View all items`,
          type: option.type,
        });
      }
      break;
  }
  for (let link of links) {
    //Let the openapi doc and interactive console be accessible to everybody
    if (link.rel !== "service-desc" && link.rel !== "service-doc") {
      link = await addApiKeyToSearchParams(ctx, link);
    }
  }
  return links;
}

async function addApiKeyToSearchParams(ctx: ExegesisContext, link: Link) {
  if (ctx.security.ApiKeyAuth) {
    if (ctx.user.apiKey) {
      //@ts-ignore
      var _tempLink = new URL(link.href);
      _tempLink.searchParams.set("apiKey", ctx.user.apiKey);
      link.href = _tempLink.toString();
    }
  }
  return link;
}

async function genLinksToColl_ItemsWhenAtRoot(
  ctx: ExegesisContext,
  collectionId: string | number,
  allowed_f_values: F_AssociatedType[]
): Promise<Link[]> {
  const { urlToThisEP } = await initCommonQueryParams(ctx);

  const links: Link[] = [];

  for (let option of allowed_f_values) {
    //links to /{collectionId}
    var _tempLink = new URL(urlToThisEP);
    _tempLink.search = "";
    _tempLink = new URL(new URL(collectionId, _tempLink + "/").toString());
    _tempLink.searchParams.set("f", option.f);
    option = await changeLinkTypeForNestLinks(
      option,
      "json",
      "application/json"
    );
    links.push({
      rel: "collection",
      href: _tempLink.toString(),
      title: `View the collection document`,
      type: option.type,
    });
    var _tempLink = new URL(urlToThisEP);
    _tempLink.search = "";
    _tempLink = new URL(
      new URL(collectionId + "/items", _tempLink + "/").toString()
    );
    _tempLink.searchParams.set("f", option.f);
    option = await changeLinkTypeForNestLinks(
      option,
      "json",
      "application/geo+json"
    );
    links.push({
      type: option.type,
      href: _tempLink.toString(),
      title: `View items included in this collection`,
      rel: "items",
    });
  }
  for (let link of links) {
    link = await addApiKeyToSearchParams(ctx, link);
  }
  return links;
}
async function changeLinkTypeForNestLinks(
  linkOption: F_AssociatedType,
  fValue: string,
  intendedType: string
): Promise<F_AssociatedType> {
  linkOption.f === fValue ? (linkOption.type = intendedType) : linkOption;
  return linkOption;
}

export { genLinksToColl_ItemsWhenAtRoot, genLinksAll };
