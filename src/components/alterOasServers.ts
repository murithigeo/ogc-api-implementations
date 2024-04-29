import os from "os";
import { oasDocServers } from "../types";
import { PORT } from "../server";

async function alterServers(servers: oasDocServers[]) {
  if (process.env.NODE_ENV === "dev") {
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
    servers.push({
      url: "http://localhost" + PORT,
      description: "Localhost",
    });
  }
  if (process.env.NODE_ENV === "prod") {
    if (process.env.PROD_URL && process.env.PORT) {
      servers.push({
        url: process.env.PROD_URL + ":" + process.env.PORT,
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
