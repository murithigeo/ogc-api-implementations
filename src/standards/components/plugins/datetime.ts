import {
  ExegesisPlugin,
  ExegesisPluginContext,
  ExegesisPluginInstance,
} from "exegesis-express";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import makeQueryValidationError from "../../components/makeValidationError";

export default function makeDateTimeParserValidator(): ExegesisPluginInstance {
  return {
    postSecurity: async (ctx: ExegesisPluginContext) => {
      const ajv = new Ajv();
      addFormats(ajv);
      const queryParamsInterface = await (await ctx.getParams()).query;

      if (queryParamsInterface.datetime) {
        /**
         * @description  Instantiate the ajv package used to validate OAS3.x.x formats
         */
        const dateTimeValidator = ajv.compile({
          type: "string",
          format: "date-time",
        });
        let result: {
          start: string | undefined;
          end: string | undefined;
          one: string | undefined;
        } = {
          start: undefined,
          end: undefined,
          one: undefined,
        };

        if (queryParamsInterface.datetime.includes("/")) {
          //i.e: timestamp/timestamp | ../timestamp | timestamp/..
          if (queryParamsInterface.datetime.startsWith("../")) {
            result.end = queryParamsInterface.datetime.split("/")[1]; //../timestamp
          } else if (queryParamsInterface.datetime.endsWith("/..")) {
            result.start = queryParamsInterface.datetime.split("/")[0]; //timestamp/..
          } else {
            result.start = queryParamsInterface.datetime.split("/")[0]; //timestamp/timestamp
            result.end = queryParamsInterface.datetime.split("/")[1];
          }
        } else {
          result.one = queryParamsInterface.datetime.replace(" ", "+"); //timestamp
        }
        /**
         * @description validate all entries in the result array to ensure that they are datetimes
         */
        for (const key in result) {
          if (result[key]) {
            result[key] = result[key].replace(" ", "+");
            if (!dateTimeValidator(result[key])) {
              ctx.res
                .status(400)
                .json(
                  await makeQueryValidationError(
                    ctx,
                    "datetime",
                    "elements of interval/datetime must be rfc 3339 compliant"
                  )
                );
            }
          }
        }
        queryParamsInterface.parseddatetime = result;
      }
    },
  };
}