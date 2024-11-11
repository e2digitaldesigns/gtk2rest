import "tsconfig-paths/register";

if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

import { twitchBot } from "./bots/twitch";
import startUpServices from "./startUpServices";

(async () => {
	try {
		const server = await startUpServices.initializeServer();
		await startUpServices.initializeMongo();
		await startUpServices.initializeSocket(server);

		await twitchBot();
	} catch (error) {
		console.error("Error during startup:", error);
	}
})();
