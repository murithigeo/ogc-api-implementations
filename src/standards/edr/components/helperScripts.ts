import { ExegesisContext } from "exegesis-express";

const instanceIdStation = (ctx: ExegesisContext) =>
  !ctx.params.path.instanceId
    ? undefined
    : { station: ctx.params.path.instanceId };

export { instanceIdStation };
