import * as types from "../types";
import * as units from "./units";
import * as observedProperties from "./observedProperties";
export default async function genParamNameObj(
  edrVariables: types.collectionConfigEdrVariable[]
) {
  let parameterNames: types.Parameter_Names = {};
  for (const parameter of edrVariables) {
    parameterNames[parameter.id] = {
      type: "Parameter",
      id: parameter.id,
      description: parameter.id + " parameter",
      "data-type": parameter.dataType,
      unit: units[parameter.unit],
      observedProperty: observedProperties[parameter.name],
    };
  }
  return parameterNames;
}
