import {
  ExegesisPlugin,
  ExegesisPluginContext,
  ExegesisPluginInstance,
} from "exegesis-express";
import { URL } from "url";
import { validate_crs_string } from "../components/params";
function makeExegesisPlugin(
  data: { apiDoc: any },
  allowed_F_values: string[],
  queryParamsToIgnore: string[],
  listOfCollections: string[]
): ExegesisPluginInstance {
  return {
    postSecurity: async (pluginContext: ExegesisPluginContext) => {
      //Access documented params. Includes path & query params
      const _oasListedParams = await pluginContext.getParams();

      //Handle collections not existent or served by the server
      if (
        _oasListedParams.path.collectionId &&
        !listOfCollections.includes(_oasListedParams.path.collectionId)
      ) {
        pluginContext.res.status(404).json({
          requestedCollection: _oasListedParams.path.collectionId,
          response: "Does not exist",
          statusCode: 404,
        });
      }
      //Handle Unexpected Query Params

      //Create a parsable url
      let _url = new URL(
        pluginContext.api.serverObject.url + pluginContext.req.url
      );

      //Access all params which have been sent: Documented and undocumentd
      const _allParams = Array.from(new URLSearchParams(_url.search).keys());

      //undocumented Params to ignore
      const allowedParams: string[] = ["apiKey"];

      //Push query params you want to ignore into the allowedparams array
      //Only if you provide some

      if (queryParamsToIgnore && queryParamsToIgnore.length > 1) {
        allowedParams.push(...queryParamsToIgnore);
      }

      //Push documented params into the allowed Params array

      if (Object.keys(_oasListedParams.query).length > 0) {
        allowedParams.push(...Object.keys(_oasListedParams.query));
      }

      //Filter the array of _allParams and return an array with all undocumented params
      const unexpectedParams = _allParams.filter(
        (param) => !allowedParams.includes(param)
      );

      //Handle

      //If any undocumented params are in the array, return status(400)
      if (unexpectedParams.length > 0) {
        pluginContext.res.status(400).setBody(
          pluginContext.makeValidationError("Invalid query parameter", {
            in: "query",
            docPath: pluginContext.api.pathItemPtr,
            name: unexpectedParams.toString(),
          })
        );
      }

      //Handle invalid content-negotiation values/f param values.
      //This is a one size fits all so document all possible f values, you will use in your application
      //Only for routes with f parameter documented
      if (
        _oasListedParams.query.f &&
        !allowed_F_values.includes(_oasListedParams.query.f)
      ) {
        pluginContext.res.status(400).setBody(
          pluginContext.makeValidationError(
            "requested content-negotiation value not supported",
            {
              in: "query",
              docPath: pluginContext.api.pathItemPtr,
              name: "f",
            }
          )
        );
      }
      //Handle invalid crs Params. Only for routes with crs or bbox-crs param
      if (_oasListedParams.query.crs || _oasListedParams.query["bbox-crs"]) {
        const _bboxcrs_Array = await validate_crs_string(
          _oasListedParams.query["bbox-crs"]
        );

        const _crs_Array = await validate_crs_string(
          _oasListedParams.query.crs
        );
        if (
          !URL.canParse(_oasListedParams.query.crs)||
          _crs_Array.length < 1 
          
        ) {
          pluginContext.res.status(400).setBody(
            pluginContext.makeValidationError("crs invalid or unsupported", {
              in: "query",
              name: "crs",
              docPath: pluginContext.api.pathItemPtr,
            })
          );
        }
        if (!URL.canParse(_oasListedParams.query['bbox-crs'])||_bboxcrs_Array.length < 1) {
          pluginContext.res.status(400).setBody(
            pluginContext.makeValidationError(
              "bbox-crs invalid or unsupported",
              {
                in: "query",
                name: "bbox-crs",
                docPath: pluginContext.api.pathItemPtr,
              }
            )
          );
        }
      }
    },
  };
}

function validateRequestsPlugin(
  allowed_F_values: string[],
  queryParamsToIgnore: string[],
  listOfCollections: string[]
): ExegesisPlugin {
  return {
    info: {
      name: "exegesis-plugin-validaterequests-featuresapi",
    },
    makeExegesisPlugin: (data: { apiDoc: any }) =>
      makeExegesisPlugin(
        data,
        allowed_F_values,
        queryParamsToIgnore,
        listOfCollections
      ),
  };
}

export default validateRequestsPlugin;