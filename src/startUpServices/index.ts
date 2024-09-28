import { initializeMongo } from "./mongoose";
import { initializeServer } from "./server";
import { initializeSocket } from "./socket";

export default {
  initializeMongo,
  initializeServer,
  initializeSocket
};
