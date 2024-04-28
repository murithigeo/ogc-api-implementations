import os from "os";
import { ServerConfig, ServersArray } from "../types";

async function genServerObjectsForDevMode(servers: ServersArray[]) {
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
        url: `http://${ips}`,
        description: `This is the internal IP address of the localmachine`,
      });
    }
    servers.push({
      url: "http://localhost",
      description: "Localhost",
    });
  }
  return servers;
}

export default genServerObjectsForDevMode;
