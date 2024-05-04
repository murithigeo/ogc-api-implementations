import * as os from "os";
import { oasDocServers } from "../types";
import { PORT } from "../server";

async function alterServers(
  servers: oasDocServers[],
  standard: "features" | "edr"
) {
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
  if (process.env.NODE_ENV === "production") {
    if (process.env.PROD_URL && process.env.PORT) {
      servers.push({
        url: `${process.env.PROD_URL}:${process.env.PORT}/${standard}`,
        description: `Production server`,
      });
    }
  }
  for (const serverObj of servers) {
    if (!URL.canParse(serverObj.url)) {
      console.log("Please provide standardized URLs");
      process.exit(1);
    }
  }
  return servers;
}

export default alterServers;
