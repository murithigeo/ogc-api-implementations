import * as os from "os";
import { oasDocServers } from "../types";
import { PORT } from "../server";

async function alterServers(
  //servers: oasDocServers[],
  standard: "features" | "edr" | ""
) {
  const servers: oasDocServers[] = [];
  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test"
  ) {
    //Must be connected to a LAN/Internet for this to work. If not connected, ip will be zero and therefore invalid
    var ifaces: any = os.networkInterfaces();
    var ips: any = 0;
    Object.keys(ifaces).forEach((dev) => {
      if (!dev.toLowerCase().includes("wsl")) {
        // Filter out WSL interfaces
        ifaces[dev].forEach((details: any) => {
          if (details.family === "IPv4" && !details.internal) {
            ips = details.address;
          }
        });
      }
    });
    if (ips !== 0) {
      servers.push({
        url: `http://${ips}:${PORT}/${standard}`,
        description: `This is the internal IP address of the localmachine`,
      });
    }

    //Only use localhost on development environment otherwise during tests, TeamEngine will throw error
    if (process.env.NODE_ENV === "development") {
      servers.push({
        url: `http://localhost:${PORT}/${standard}`,
        description: "Localhost",
      });
    }
  }
  if(process.env.NODE_ENV==="production"&&!process.env.PROD_URL){
    throw new Error("At least 1 url to server must be defined")
  }
  process.env.PROD_URL
    ? servers.push({
        url: `${process.env.PROD_URL}/${standard}`,
        description: "Live production server",
      })
    : servers;

    
  process.env.PROD_URL2
    ? servers.push({
        url: `${process.env.PROD_URL2}/${standard}`,
        description: "Live production server",
      })
    : servers;
  for (const serverObj of servers) {
    if (!URL.canParse(serverObj.url)) {
      console.log("Please provide standardized URLs");
      process.exit(1);
    }
  }
  if(servers.length<1){
    throw new Error("At least 1 server must be defined")
  }
  
  //Log the baseurl of the new primary url
  const _firstServer = new URL(servers[0].url);
  console.log(
    `Primary URL is: ${_firstServer.protocol}//${_firstServer.hostname}`
  );

  return servers;
}

export default alterServers;
