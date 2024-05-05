import * as os from "os";
import { oasDocServers } from "../types";
import { PORT } from "../server";

async function alterServers(
  servers: oasDocServers[],
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
        url: `http://${ips}:${PORT}`,
        description: `This is the internal IP address of the localmachine`,
      });
    }

    //Only use localhost on development environment otherwise during tests, TeamEngine will throw error
    if (process.env.NODE_ENV === "development") {
      servers.push({
        url: `http://localhost:${PORT}`,
        description: "Localhost",
      });
    }
  }


  process.env.PROD_URL
    ? servers.push({
        url: `${process.env.PROD_URL}:${process.env.PORT}`,
        description: "Live production server 1"
      })
    : servers;
    process.env.PROD_URL2
    ? servers.push({
        url: `${process.env.PROD_URL2}:${process.env.PORT}`,
        description: "Live production server 2"
      })
    : servers;
  for (const serverObj of servers) {
    if (!URL.canParse(serverObj.url)) {
      console.log("Please provide standardized URLs");
      process.exit(1);
    }
  }
  return servers;
}

export default alterServers;
