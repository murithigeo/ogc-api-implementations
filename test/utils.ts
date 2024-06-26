import { ParametersByLocation, ParametersMap } from "exegesis-express";
import serverIndex from "../src/server";
const testPort = 2500;
/*
const serverInstance = serverIndex().then((server) => {
  server.listen(testPort);
  console.log(`Servr instance initialized at: `, testPort);
});
export default serverInstance;

*/
const ctxParams: ParametersByLocation<ParametersMap<any>> = {
  query: {},
  path: {},
  header: {},
  cookie: {},
  server: {},
};

export { ctxParams };
