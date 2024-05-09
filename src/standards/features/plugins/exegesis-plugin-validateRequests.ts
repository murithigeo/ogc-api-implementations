import {
  ExegesisPlugin,
  ExegesisPluginContext,
  ExegesisPluginInstance,
} from "exegesis-express";
import { URL } from "url";
import { validate_crs_string } from "../components/params";
import { crs84hUri } from "..";
function makeExegesisPlugin(
  data: { apiDoc: any },
  allowed_F_values: string[],
  queryParamsToIgnore: string[],
  listOfCollections: string[]
): ExegesisPluginInstance {
  return {
    preRouting: ({req,res})=>{
      
      //console.log("before",req.headers)
      //req.protocol="https"
      //console.log("after",req.protocol)
    },
    postSecurity: async (pluginContext: ExegesisPluginContext) => {
pluginContext.isResponseFinished
      //Access documented params. Includes path & query params
      const _oasListedParams = await pluginContext.getParams();
      //console.log('collid',_oasListedParams.path.collectionId);
      //Handle collections not existent or served by the server
      if (_oasListedParams.path.collectionId === "") {
        pluginContext.res.status(400).setBody(
          pluginContext.makeValidationError(
            "collectionId cannot be an empty string",
            {
              in: "path",
              name: "collectionId",
              docPath: pluginContext.api.pathItemPtr,
            }
          )
        );
      }

      //cover the gray are between the length of the bounding box
      //minLength=4
      //maxLength=6
      //Means that we can not validate requests with a length of 5
      if (
        _oasListedParams.query.bbox &&
        _oasListedParams.query.bbox.length === 5
      ) {
        pluginContext.res.status(400).setBody(
          pluginContext.makeValidationError(
            "bbox can only have 4 or 6 elements",
            {
              in: "query",
              docPath: pluginContext.api.pathItemPtr,
              name: "bbox",
            }
          )
        );
      }
      if (_oasListedParams.path.collectionId) {
        if (!listOfCollections.includes(_oasListedParams.path.collectionId)) {
          pluginContext.res.status(404).json({
            requestedCollection: _oasListedParams.path.collectionId,
            response: "Does not exist",
            statusCode: 404,
          });
        }
      }
      //Handle Unexpected Query Params

      //Create a parsable url
      let _url = new URL(
        pluginContext.api.serverObject.url + pluginContext.req.url
      );

      //Access all params which have been sent: Documented and undocumentd
      const _allParams = Array.from(new URLSearchParams(_url.search).keys());

      //undocumented Params to ignore
      const allowedParams: string[] = [];

      //Push query params you want to ignore into the allowedparams array
      //Only if you provide some

      if (queryParamsToIgnore && queryParamsToIgnore.length > 0) {
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
      if (
        _oasListedParams.query.crs &&
        !(await validate_crs_string(_oasListedParams.query.crs))
      ) {
        pluginContext.res.status(400).setBody(
          pluginContext.makeValidationError("crs invalid or unsupported", {
            in: "query",
            name: "crs",
            docPath: pluginContext.api.pathItemPtr,
          })
        );
      }

      //Handle invalid bboxcrs
      if (_oasListedParams.query["bbox-crs"]) {
        if (!(await validate_crs_string(_oasListedParams.query["bbox-crs"]))) {
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

      //Validate CRS84h and bbox/

      //Awaiting answer on expected behavior
      /*
      if (
        _oasListedParams.query["bbox-crs"] === crs84hUri &&
        _oasListedParams.query.bbox.length < 6
      ) {
        pluginContext.res
          .status(400)
          .setBody(
            pluginContext.makeValidationError(
              "bbox elements must be exactly 6 items",
              {
                in: "query",
                name: "bbox",
                docPath: pluginContext.api.pathItemPtr,
              }
            )
          );
      }
          */
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
