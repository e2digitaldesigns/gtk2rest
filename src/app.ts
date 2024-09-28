if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

import { twitch } from "./bots/twitch";
import startUpServices from "./startUpServices";

(async () => {
  const server = await startUpServices.initializeServer();
  await startUpServices.initializeMongo();
  await startUpServices.initializeSocket(server);
  await twitch();
})();
