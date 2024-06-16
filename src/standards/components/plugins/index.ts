import {
  ExegesisOptions,
  ExegesisPlugin,
  ExegesisPluginInstance,
} from "exegesis-express";
import makeCoordsPlugin from "./coords";
import makeQueryParamsParserValidatorPlugin from "./queryParams";
import makeDateTimeParserValidator from "./datetime";
import makeCoordsRefSysParserValidatorPlugin from "./coordRefSys";
import makeBboxParserValidatorPlugin from "./bbox";
import makeZParserValidator from "./z";
import makeParameterNamesValidatorPlugin from "./parameterNames";
import makeCubeOperationsValidatorPlugin from "./cube";
import makeCollectionOrInstanceIdValidatorPlugin from "./collectionOrInstanceId";
import MakeFParserValidatorPlugin from "./f";
export const allowedQueryTypes: string[] = [
  "instances",
  "locations",
  "items",
  "radius",
  "position",
  "area",
  "trajectory",
  "corridor",
  "cube",
];

export default function allPlugins(
  undocumentedQueryParamsToIgnore: string[]
): ExegesisPlugin[] {
  const rawPlugins = [
    makeCoordsPlugin(),
    makeQueryParamsParserValidatorPlugin(undocumentedQueryParamsToIgnore),
    makeDateTimeParserValidator(),
    makeCoordsRefSysParserValidatorPlugin(),
    makeBboxParserValidatorPlugin(),
    makeZParserValidator(),
    makeParameterNamesValidatorPlugin(),
    makeCubeOperationsValidatorPlugin(),
    makeCollectionOrInstanceIdValidatorPlugin(),
    MakeFParserValidatorPlugin(),
  ];
  const plugins: ExegesisPlugin[] = [];
  for (const plugin of rawPlugins) {
    plugins.push({
      info: {
        name: "exegesis-plugin" + plugin.postSecurity.name,
      },
      makeExegesisPlugin(data) {
        return plugin;
      },
    });
  }
  return plugins;
}
