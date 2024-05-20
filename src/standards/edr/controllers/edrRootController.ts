import { ExegesisContext } from "exegesis-express";
import convertJsonToYAML from "../../features/components/convertToYaml";
import makeQueryValidationError from "../../components/makeValidationError";
import { EDRLandingPage } from "../types";

async function edrGetRoot(ctx: ExegesisContext) {
  //@ts-ignore
  const landingPageDoc: EDRLandingPage = {
    title:
      "Landing page for the Environmental Data Retrieval API. \n (c) 2024 Murithigeo",
    description:
      "This API is meant to demonstrate the ease of developing a robust EDR API for environmental variables such as weather conditions. \n Can also be used to retrieve other variables such as statistics",
    keywords: ["weather", "ogc", "edr", "temperature"],
    provider: {
      name: "Kenya Meterological Department through archives of NOAA",
      url: "https://meteo.go.ke",
    },
    contact: {
      address: "Ngong",
      city: "Nairobi",
      stateorprovince: "Nairobi County",
      hours: "0800H - 1700H",
      country: "KEN",
    },
  };
  switch (ctx.params.query.f) {
    case "json":
      ctx.res
        .status(200)
        .set("content-type", "application/json")
        .json(landingPageDoc)
        .end();
      break;
    case "yaml":
      ctx.res
        .status(200)
        .set("content-type", "text/yaml")
        .setBody(await convertJsonToYAML(landingPageDoc))
        .end();
      break;
    default:
      ctx.res.status(400).json(await makeQueryValidationError(ctx, "f"));
  }
}

export default edrGetRoot;
