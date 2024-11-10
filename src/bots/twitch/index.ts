import { RefreshingAuthProvider } from "@twurple/auth";
import { Bot } from "@twurple/easy-bot";
import * as botFunctions from "./functions";
import { messageHandler } from "./messageHandler";

const clientId = process.env.TWITCH_CLIENT_ID as string;
const clientSecret = process.env.TWITCH_CLIENT_SECRET as string;

let twitchBotClient: Bot | undefined;
let messageListener: any;
let disconnectListener: any;

const authProvider = new RefreshingAuthProvider({
	clientId,
	clientSecret
});

authProvider.onRefresh(async (userId, newTokenData) =>
	console.log(`Refreshed token for user ${userId}: ${newTokenData.accessToken}`)
);

export async function twitchBot(initialStart = true): Promise<Bot> {
	const tokenData = await botFunctions.refreshAccessToken();

	if (!tokenData) {
		throw new Error("Failed to get a valid access token.");
	}

	await authProvider.addUserForToken(tokenData, ["chat"]);

	twitchBotClient = new Bot({
		authProvider,
		channels: await botFunctions.getTwitchChannels()
	});

	if (initialStart) {
		twitchBotClientListener();
	}

	return twitchBotClient;
}

const twitchBotClientListener = async () => {
	if (!twitchBotClient) {
		throw new Error("twitchBotClientListener - The TwitchBot has not been initialized yet.");
	}

	if (messageListener) await twitchBotClient.removeListener(messageListener);
	if (disconnectListener) await twitchBotClient.removeListener(disconnectListener);
	twitchBotClient.removeListener();

	disconnectListener = twitchBotClient.onDisconnect(async error => {
		console.error("Bot disconnected", error);
		console.log("Waiting 5 seconds before attempting to reconnect...");

		await new Promise(resolve => setTimeout(resolve, 5000));
		console.log("Attempting to reconnect...");

		try {
			twitchBotClient = await twitchBot(false);
			console.log("Reconnected to Twitch.");
		} catch (err) {
			console.error("Failed to reconnect:", err);
		}
	});

	messageListener = twitchBotClient.onMessage(messageHandler);
};

export const sendTwitchChatMessage = (channel: string, message: string) => {
	if (!twitchBotClient) {
		throw new Error("sendTwitchChatMessage - The TwitchBot has not been initialized yet.");
	}
	twitchBotClient.say(channel, message);
};

export const isChannelInClient = (channel: string) => {
	if (!twitchBotClient) {
		throw new Error("isChannelInClient - The TwitchBot has not been initialized yet.");
	}

	const currentChannels = twitchBotClient.chat.currentChannels;
	return currentChannels.includes("#" + channel.toLowerCase());
};

export const addChannel = async (channel: string) => {
	if (!twitchBotClient) {
		throw new Error("addChannel - The TwitchBot has not been initialized yet.");
	}

	await twitchBotClient.chat.join(channel.toLowerCase());
	const isInClient = true;
	return isInClient;
};

export const removeChannel = async (channel: string) => {
	if (!twitchBotClient) {
		throw new Error("removeChannel  - The TwitchBot has not been initialized yet.");
	}

	await twitchBotClient.chat.part(channel.toLowerCase());
};

export const twitchBotTester = async () => {
	if (!twitchBotClient) {
		throw new Error("twitchBotTester - The TwitchBot has not been initialized yet.");
	}

	return {
		currentChannels: twitchBotClient.chat.currentChannels,
		isIconConnected: twitchBotClient.chat.currentChannels.includes("icon33"),
		isIconHashConnected: twitchBotClient.chat.currentChannels.includes("#icon33")
	};
};

async function getDataWithDelay(channel: string): Promise<boolean> {
	return new Promise(async resolve => {
		setTimeout(async () => {
			const data = await isChannelInClient(channel);
			resolve(data);
		}, 1000);
	});
}
