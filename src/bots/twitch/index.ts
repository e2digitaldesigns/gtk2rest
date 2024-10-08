import { RefreshingAuthProvider } from "@twurple/auth";
import { Bot, MessageEvent, createBotCommand } from "@twurple/easy-bot";
import * as botFunctions from "./functions";

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
    throw new Error("The TwitchBot has not been initialized yet.");
  }

  if (messageListener) await twitchBotClient.removeListener(messageListener);
  if (disconnectListener) await twitchBotClient.removeListener(disconnectListener);
  twitchBotClient.removeListener();

  disconnectListener = twitchBotClient.onDisconnect(async error => {
    console.error("Bot disconnected", error);

    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log("Attempting to reconnect...");

    try {
      twitchBotClient = await twitchBot(false);
      console.log("Reconnected to Twitch.");
    } catch (err) {
      console.error("Failed to reconnect:", err);
    }
  });

  messageListener = twitchBotClient.onMessage(async (arg: MessageEvent) => {
    console.log(arg.userDisplayName, "said:", arg.text);
    if (arg.text === "!test") {
      twitchBotClient?.say(arg.broadcasterName, "Testing 123");
    }
  });
};

export const sendTwitchChatMessage = (channel: string, message: string) => {
  if (!twitchBotClient) {
    throw new Error("The TwitchBot has not been initialized yet.");
  }
  twitchBotClient.say(channel, message);
};
