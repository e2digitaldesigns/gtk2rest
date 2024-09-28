if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

import startUpServices from "./startUpServices";

const server = startUpServices.initializeServer();
startUpServices.initializeMongo();
startUpServices.initializeSocket(server);
