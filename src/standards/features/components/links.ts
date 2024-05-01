import { ExegesisContext } from "exegesis-express";
import { URL, URLSearchParams, Url } from "url";
import { F_AssociatedType, Link } from "../../../types";
import initCommonQueryParams from "./params";

async function filter_f_types(
  context: ExegesisContext,
  allowed_f_values: F_AssociatedType[]
): Promise<{
  optionsForSelf: F_AssociatedType[];
  optionsForAlt: F_AssociatedType[];
}> {
  const { f } = await initCommonQueryParams(context);
  /**
   * Given that a web resource can only have one Content-Type header, return only the first element of @optionsForSelf
   */
  const optionsForSelf = allowed_f_values
    .filter((obj) => obj.f === f)
    .slice(0, 1);

  const optionsForAlt = allowed_f_values.filter((obj) => obj.f !== f);
  return { optionsForSelf, optionsForAlt };
}

async function genSelfAltLinks(
  context: ExegesisContext,
  optionsForSelf: F_AssociatedType[],
  optionsForAlt: F_AssociatedType[]
): Promise<Link[]> {
  const { urlToThisEP } = await initCommonQueryParams(context);
  //currentUrl.pathname = context.req.url;
  const links: Link[] = [];

  for (const option of optionsForSelf) {
    urlToThisEP.searchParams.set("f", `${option.f}`);
    links.push({
      rel: `self`,
      title: `This document as ${option.f}`,
      href: urlToThisEP.toString(),
      type: option.type,
    });
  }
  for (const option of optionsForAlt) {
    urlToThisEP.searchParams.set(`f`, `${option.f}`);
    links.push({
      rel: `alternate`,
      title: `This document as ${option.f}`,
      href: urlToThisEP.toString(),
      type: option.type,
    });
  }
  return links;
}
async function genPrevNextLinks(
  context: ExegesisContext,
  optionsForSelf: F_AssociatedType[]
): Promise<Link[]> {
  const links: Link[] = [];
  const { urlToThisEP } = await initCommonQueryParams(context);
  const { nextPageOffset, prevPageOffset } = await initCommonQueryParams(
    context
  );
  urlToThisEP.searchParams.set("offset", `${nextPageOffset}`);
  links.push({
    rel: "next",
    href: urlToThisEP.toString(),
    title: `View the next page of results`,
    type: optionsForSelf[0].type,
  });
  urlToThisEP.searchParams.set("offset", `${prevPageOffset}`);
  links.push({
    rel: "prev",
    href: urlToThisEP.toString(),
    title: `View the previous page of results`,
    type: optionsForSelf[0].type,
  });
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
async function genLinkToCollectionFromItems(
  context: ExegesisContext,
  optionsForSelf: F_AssociatedType[],
  optionsForAlt: F_AssociatedType[]
): Promise<Link[]> {
  const { urlToThisEP } = await initCommonQueryParams(context);
  urlToThisEP.pathname.slice(0, -urlToThisEP.pathname.split("/").pop().length);
  //const {}= await filter_f_types(context,)
  const links: Link[] = [];
  for (let option of optionsForSelf) {
    option = await changeLinkTypeForNestLinks(
      option,
      "json",
      "application/json"
    );
    urlToThisEP.searchParams.set("f", `${option.f}`);
    links.push({
      title: `View the collection document as ${option.f}`,
      href: urlToThisEP.toString(),
      type: option.type,
      rel: "collection",
    });
  }
  for (let option of optionsForAlt) {
    option = await changeLinkTypeForNestLinks(
      option,
      "json",
      "application/json"
    );
    urlToThisEP.searchParams.set("f", `${option.f}`);
    links.push({
      href: urlToThisEP.toString(),
      title: `View the collection document as ${option.f}`,
      type: option.type,
      rel: `collection`,
    });
  }
  return links;
}

async function genLinkToCollectionFromFeature(
  context: ExegesisContext,
  optionsForSelf: F_AssociatedType[],
  optionsForAlt: F_AssociatedType[]
): Promise<Link[]> {
  const { urlToThisEP } = await initCommonQueryParams(context);
  urlToThisEP.pathname = urlToThisEP.pathname.slice(
    0,
    -urlToThisEP.pathname.split("/").length
  );
  const links: Link[] = [];
  for (let option of optionsForSelf) {
    urlToThisEP.searchParams.set("f", `${option.f}`);
    //urlToThisEP = addApiKeyToSearchParams(context, urlToThisEP);
    links.push({
      rel: "collection",
      type: option.type,
      title: `View the collection document as ${option.f}`,
      href: urlToThisEP.toString(),
    });
  }
  for (let option of optionsForAlt) {
    urlToThisEP.searchParams.set(`f`, `${option.f}`);
    links.push({
      href: urlToThisEP.toString(),
      title: `View the collection document as ${option.f}`,
      type: option.type,
      rel: `collection`,
    });
  }
  return links;
}
async function addApiKeyToSearchParams(
  context: ExegesisContext,
  linkToTargetEndpoint: URL
): Promise<URL> {
  if (context.security) {
    if (context.security.apiKey) {
      if (context.security.apiKeyAuth) {
        if (context.security.apiKeyAuth.user) {
          if (context.security.apiKeyAuth.user.apiKey) {
            linkToTargetEndpoint.searchParams.set(
              "apiKey",
              `${context.security.apiKeyAuth.user.apiKey}`
            );
          }
        }
      }
    }
  }
  return linkToTargetEndpoint;
}
export async function genLinksToItemsFromCollection(
  context: ExegesisContext,
  optionsForSelf: F_AssociatedType[],
  optionsForAlt: F_AssociatedType[],
  mode: "root" | "nested",
  collectionId?: string | number
): Promise<Link[]> {
  //When mode=root then urlToThisEP = /collections
  //else urlToThisEP=/collections/{collectionId}
  const { urlToThisEP } = await initCommonQueryParams(context);
  urlToThisEP.search = "";

  if (mode === "nested") {
    const links: Link[] = [];
    for (let option of optionsForSelf) {
      option = await changeLinkTypeForNestLinks(
        option,
        "json",
        "application/geo+json"
      );
      let urlForOption = new URL(urlToThisEP.href);
      urlForOption.pathname = urlForOption.pathname + "/items";
      console.log(urlForOption.href);
      urlForOption.searchParams.set(`f`, option.f);
      links.push({
        rel: `items`,
        href: urlForOption.toString(),
        title: `View the items of this collection as ${option.f}`,
        type: option.type,
      });
    }
    for (let option of optionsForAlt) {
      let urlForOption = new URL(urlToThisEP.href);
      urlForOption.pathname = urlForOption.pathname + "/items";
      urlForOption.searchParams.set(`f`, option.f);
      //urlToThisEP.searchParams.set("f", option.f);
      option = await changeLinkTypeForNestLinks(
        option,
        "json",
        "application/geo+json"
      );
      links.push({
        rel: "items",
        href: urlToThisEP.toString(),
        title: `View the items in this collection as ${option.f}`,
        type: option.type,
      });
    }
    return links;
  } else {
    const links: Link[] = [];

    //Links to collections
    for (let option of optionsForSelf) {
      ///Links to items
      let urlForOption = new URL(urlToThisEP.href);
      urlForOption.pathname=urlForOption.pathname + collectionId+'/items';
      urlForOption.searchParams.set(`f`, option.f);
      links.push({
        rel: `items`,
        href: urlForOption.toString(),
        title: `View the items of this collection as ${option.f}`,
        type: option.type,
      });
    }
    for (let option of optionsForAlt) {
      let urlForOption = new URL(urlToThisEP.href);
      urlForOption.pathname=urlForOption.pathname + collectionId+'/items';
      urlForOption.searchParams.set(`f`, option.f);
      //urlToThisEP.searchParams.set("f", option.f);

      links.push({
        rel: "items",
        href: urlForOption.toString(),
        title: `View the items in this collection as ${option.f}`,
        type: option.type,
      });
    }
    for (let option of optionsForSelf) {
      ///Links to items
      option = await changeLinkTypeForNestLinks(
        option,
        "json",
        "application/geo+json"
      );
      let urlForOption = new URL(urlToThisEP.href);
      urlForOption.pathname + collectionId + "/items";
      urlForOption.searchParams.set(`f`, option.f);
      links.push({
        rel: `items`,
        href: urlForOption.toString(),
        title: `View the items of this collection as ${option.f}`,
        type: option.type,
      });
    }
    for (let option of optionsForAlt) {
      let urlForOption = new URL(urlToThisEP.href);
      urlForOption.pathname + collectionId + "/items";
      urlForOption.searchParams.set(`f`, option.f);
      //urlToThisEP.searchParams.set("f", option.f);
      option = await changeLinkTypeForNestLinks(
        option,
        "json",
        "application/geo+json"
      );
      links.push({
        rel: "items",
        href: urlToThisEP.toString(),
        title: `View the items in this collection as ${option.f}`,
        type: option.type,
      });
    }
    return links;
  }
}

async function genLinksToItemsFromFeature(
  context: ExegesisContext,
  optionsForSelf: F_AssociatedType[],
  optionsForAlt: F_AssociatedType[]
): Promise<Link[]> {
  const { urlToThisEP } = await initCommonQueryParams(context);
  urlToThisEP.pathname = urlToThisEP.pathname.slice(
    0,
    -urlToThisEP.pathname.split("/").pop.length
  );
  const links: Link[] = [];
  for (let option of optionsForSelf) {
    urlToThisEP.searchParams.set("f", option.f);
    links.push({
      href: urlToThisEP.toString(),
      rel: `items`,
      title: `View all items as ${option.f}`,
      type: option.type,
    });
  }
  for (let option of optionsForAlt) {
    urlToThisEP.searchParams.set("f", option.f);
    links.push({
      href: urlToThisEP.toString(),
      title: `View all items as ${option.f}`,
      type: option.type,
      rel: "items",
    });
  }
  return links;
}
async function genLinksForFeature(
  context: ExegesisContext,
  allowed_f_values: F_AssociatedType[]
) {
  const links: Link[] = [];

  //Gen optionsfor Self&Alt
  const { optionsForAlt, optionsForSelf } = await filter_f_types(
    context,
    allowed_f_values
  );
  //Add self & alternate rel value links
  links.push(
    ...(await genSelfAltLinks(context, optionsForSelf, optionsForAlt))
  );

  //Add links to collection
  links.push(
    ...(await genLinkToCollectionFromFeature(
      context,
      optionsForSelf,
      optionsForAlt
    ))
  );

  //Add links to itemsEndpoint
  links.push(
    ...(await genLinksToItemsFromFeature(
      context,
      optionsForSelf,
      optionsForAlt
    ))
  );

  //Add links to
}

async function genLinksForFeatureCollection(
  context: ExegesisContext,
  allowed_f_values: F_AssociatedType[]
): Promise<Link[]> {
  const { optionsForAlt, optionsForSelf } = await filter_f_types(
    context,
    allowed_f_values
  );
  const links = await genSelfAltLinks(context, optionsForSelf, optionsForAlt);

  //Add rel prev&next links
  links.push(...(await genPrevNextLinks(context, optionsForSelf)));

  //Add links to collection
  links.push(
    ...(await genLinkToCollectionFromItems(
      context,
      optionsForSelf,
      optionsForAlt
    ))
  );

  //Add links to
  return links;
}

async function genLinksForCollection(
  context: ExegesisContext,
  allowed_f_values: F_AssociatedType[],
  mode: "root" | "nested"
) {
  const { optionsForAlt, optionsForSelf } = await filter_f_types(
    context,
    allowed_f_values
  );
  const links: Link[] = [];

  if (mode === "nested") {
    //Self Alt Links
    links.push(
      ...(await genSelfAltLinks(context, optionsForSelf, optionsForAlt))
    );
    links.push(
      ...(await genLinksToItemsFromCollection(
        context,
        optionsForSelf,
        optionsForAlt,
        "nested"
      ))
    );
  }
  if (mode === "root") {
    //Link to Items
    links.push(
      ...(await genLinksToItemsFromCollection(
        context,
        optionsForSelf,
        optionsForAlt,
        "nested"
      ))
    );
  }

  return links;
}

async function genLinksForConformance(
  context: ExegesisContext,
  allowed_f_values: F_AssociatedType[]
): Promise<Link[]> {
  const { optionsForSelf, optionsForAlt } = await filter_f_types(
    context,
    allowed_f_values
  );

  const links: Link[] = [];

  links.push(
    ...(await genSelfAltLinks(context, optionsForSelf, optionsForAlt))
  );
  return links;
}

async function _rootSpecificLinks(
  origLinkToEP: URL,
  optionsForSelf: F_AssociatedType[],
  optionsForAlt: F_AssociatedType[]
) {
  const links: Link[] = [];
  origLinkToEP.search = "";

  //links to /conformance && /collections (link to same content type as the one user is currently on)
  for (const option of optionsForSelf) {
    let urlForOption = new URL(origLinkToEP.href);
    urlForOption.pathname + "conformance";
    urlForOption.searchParams.set("f", option.f);
    links.push({
      rel: "conformance",
      title: `View the conformance document as ${option.f}`,
      href: urlForOption.toString(),
      type: option.type,
    });
    urlForOption = new URL(origLinkToEP.href);
    urlForOption.pathname + "collections";
    urlForOption.searchParams.set("f", option.f);
    links.push({
      rel: "data",
      title: `View the collections document as ${option.f}`,
      href: urlForOption.toString(),
      type: option.type,
    });
  }
  //links to /conformance && /collections (link to different content type as the one user is currently on)
  for (const option of optionsForAlt) {
    //conformance
    let urlForOption = new URL(origLinkToEP.href);
    urlForOption.pathname + "conformance";
    urlForOption.searchParams.set("f", option.f);
    links.push({
      rel: "conformance",
      title: `View the conformance document as ${option.f}`,
      href: urlForOption.toString(),
      type: option.type,
    });

    //collections
    urlForOption = new URL(origLinkToEP.href);
    urlForOption.pathname + "collections";
    urlForOption.searchParams.set("f", option.f);
    links.push({
      rel: "data",
      title: `View the collections document as ${option.f}`,
      href: urlForOption.toString(),
      type: option.type,
    });
  }

  //Links to /api && /api.html

  let urlForOption = new URL(origLinkToEP.href);

  urlForOption.pathname = origLinkToEP.pathname + `api`;
  links.push({
    rel: "service-desc",
    type: `application/vnd.oai.openapi+json;version=3.0`,
    title: `View the OpenAPI Spec Doc`,
    href: urlForOption.toString(),
  });
  urlForOption = new URL(origLinkToEP.href);
  urlForOption.pathname = urlForOption.pathname + "api.html";
  links.push({
    rel: "service-doc",
    type: "text/html",
    title: `View the OpenAPI Spec Doc on an Interactive Web Console`,
    href: urlForOption.toString(),
  });
  return links;
}
async function genLinksForRoot(
  context: ExegesisContext,
  allowed_f_values: F_AssociatedType[]
) {
  const links: Link[] = [];
  const { optionsForAlt, optionsForSelf } = await filter_f_types(
    context,
    allowed_f_values
  );

  //self & alt
  links.push(
    ...(await genSelfAltLinks(context, optionsForSelf, optionsForAlt))
  );

  const { urlToThisEP } = await initCommonQueryParams(context);
  urlToThisEP.search = "";

  //Push links to /api, /api.html, /conformance & /collections
  links.push(
    ...(await _rootSpecificLinks(urlToThisEP, optionsForSelf, optionsForAlt))
  );
  return links;
}

async function genLinkForCollectionsRoot(
  context: ExegesisContext,
  allowed_f_values: F_AssociatedType[]
): Promise<Link[]> {
  const { optionsForSelf, optionsForAlt } = await filter_f_types(
    context,
    allowed_f_values
  );
  const links: Link[] = await genSelfAltLinks(
    context,
    optionsForSelf,
    optionsForAlt
  );

  /*
  links.push(
    ...(await genLinksToItemsFromCollection(
      context,
      optionsForSelf,
      optionsForAlt,
      "root",
      collectionId
    ))
    
  );
  */
  return links;
}

export {
  genLinksForFeatureCollection,
  genLinksForFeature,
  genLinksForCollection,
  genLinksForConformance,
  genLinksForRoot,
  genLinkForCollectionsRoot,
};
