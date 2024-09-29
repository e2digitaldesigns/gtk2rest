if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

import { twitch } from "./bots/twitch";
import * as twitchBotFunctions from "./bots/twitch/functions";
import startUpServices from "./startUpServices";

(async () => {
  try {
    const server = await startUpServices.initializeServer();
    await startUpServices.initializeMongo();
    await startUpServices.initializeSocket(server);

    // Get a valid access token initially
    // await twitchBotFunctions.refreshAccessToken();

    // Initialize the Twitch bot
    await twitch();

    // Set an interval to refresh the access token every 4 minutes
    twitchBotFunctions.autoRefreshAccessToken();
  } catch (error) {
    console.error("Error during startup:", error);
  }
})();
