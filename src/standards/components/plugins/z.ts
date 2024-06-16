import {
  ExegesisPluginContext,
  ExegesisPluginInstance,
} from "exegesis-express";
import makeQueryValidationError from "../../components/makeValidationError";

export default function makeZParserValidator(
): ExegesisPluginInstance {
  return {
    postSecurity: async (ctx: ExegesisPluginContext) => {
      const oasListedQueryParams = (await ctx.getParams()).query;
      //Validate and parse z
      if (oasListedQueryParams.z) {
        const errorValidationMessge =
          "Check that the query matches the interval schema";
        interface NewZ {
          max: undefined | number;
          min: undefined | number;
          in: undefined | number[];
          one: undefined | number;
          //incrementBy: undefined | number;
          //intervalNumber: undefined | number;
        }
        let newZ = {
          max: undefined,
          min: undefined,
          in: undefined,
          one: undefined,
          //incrementBy: undefined,
          //intervalNumber: undefined,
        };
        const zparam = (oasListedQueryParams.z as string).toUpperCase();
        if (zparam.startsWith("R")) {
          //input R10/20/30
          //After removing R & splitting [10,20,30]
          const parsedZ = zparam
            .substring(1)
            .split("/")
            .filter((z) => z !== "");
          if (parsedZ.length < 3) {
            ctx.res
              .status(400)
              .json(
                await makeQueryValidationError(ctx, "z", errorValidationMessge)
              );
            return;
          }
          if (parsedZ.length > 3) {
            ctx.res
              .status(400)
              .json(
                await makeQueryValidationError(ctx, "z", errorValidationMessge)
              )
              .end();
          }
          for (const val of parsedZ) {
            if (isNaN(Number(val))) {
              ctx.res.status(400).json(
                ctx.makeValidationError("Invalid datatype", {
                  in: "query",
                  name: "z",
                  docPath: ctx.api.pathItemPtr,
                })
              );
            }
          }
          newZ.in = [];
          for (
            //Generate intervals using the param provided
            let i = parseInt(parsedZ[1], 10);
            i <=
            parseInt(parsedZ[1], 10) +
              parseInt(parsedZ[0], 10) * parseInt(parsedZ[2]);
            i += parseInt(parsedZ[2], 10)
          ) {
            newZ.in.push(i);
          }
        } else if (zparam.includes("/")) {
          const parsedZ = zparam.split("/").filter((z) => z !== "");
          if (parsedZ.length < 2) {
            ctx.res
              .status(400)
              .json(
                await makeQueryValidationError(ctx, "z", errorValidationMessge)
              );
          }
          if (parsedZ.length > 2) {
            ctx.res
              .status(400)
              .json(
                await makeQueryValidationError(ctx, "z", errorValidationMessge)
              );
          }
          for (const val of parsedZ) {
            if (isNaN(Number(val))) {
              ctx.res.status(400).json(
                ctx.makeValidationError("Invalid datatype", {
                  in: "query",
                  name: "z",
                  docPath: ctx.api.pathItemPtr,
                })
              );
            }
          }
          newZ.min = parsedZ[0];
          newZ.max = parsedZ[1];
        } else if (zparam.includes(",")) {
          const parsedZ = zparam.split(",").filter((z) => z !== "");
          for (const val of parsedZ) {
            if (isNaN(Number(val))) {
              ctx.res.status(400).json(
                ctx.makeValidationError("Invalid datatype", {
                  in: "query",
                  name: "z",
                  docPath: ctx.api.pathItemPtr,
                })
              );
            }
          }
          newZ.in = parsedZ;
        } else {
          newZ.one = zparam;
        }

        oasListedQueryParams.parsedz = newZ as NewZ;
        //ctx.res.status(400).json({ message: "Z param catch" });
      }
    },
  };
}

/**
 * 
export default function makeZParserValidator(data: {
  apiDoc: any;
}): ExegesisPluginInstance {
  return {postSecurity:async(ctx:ExegesisPluginContext)=>{}};
}

 */
