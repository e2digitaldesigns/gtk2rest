import { RefreshingAuthProvider } from "@twurple/auth";
import { Bot, MessageEvent, createBotCommand } from "@twurple/easy-bot";
import * as botFunctions from "./functions";

const clientId = process.env.TWITCH_CLIENT_ID as string;
const clientSecret = process.env.TWITCH_CLIENT_SECRET as string;

let twitchBotClient: Bot | undefined;

const authProvider = new RefreshingAuthProvider({
  clientId,
  clientSecret
});

authProvider.onRefresh(async (userId, newTokenData) =>
  console.log(`Refreshed token for user ${userId}: ${newTokenData.accessToken}`)
);

export async function twitchBot() {
  const tokenData = await botFunctions.refreshAccessToken();

  if (!tokenData) {
    throw new Error("Failed to get a valid access token.");
  }

  await authProvider.addUserForToken(tokenData, ["chat"]);

  twitchBotClient = new Bot({
    authProvider,
    channels: await botFunctions.getTwitchChannels(),
    commands: [
      createBotCommand("dice", (params, { reply }) => {
        const diceRoll = Math.floor(Math.random() * 6) + 1;
        reply(`You rolled a ${diceRoll}`);
      })
    ]
  });

  twitchBotClient.onConnect(() => console.log("Bot connected to Twitch."));

  twitchBotClient.onDisconnect(async error => {
    console.error("Bot disconnected", error);

    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log("Attempting to reconnect...");

    try {
      twitchBotClient = await twitchBot();
      console.log("Reconnected to Twitch.");
    } catch (err) {
      console.error("Failed to reconnect:", err);
    }
  });

  twitchBotClient.onMessage(async (arg: MessageEvent) => {
    console.log(arg.userDisplayName, "said:", arg.text);
    const user = await arg.getUser();
    console.log(user.profilePictureUrl);
  });

  return twitchBotClient;
}

export const sendTwitchChatMessage = (channel: string, message: string) => {
  if (!twitchBotClient) {
    throw new Error("The TwitchBot has not been initialized yet.");
  }
  twitchBotClient.say(channel, message);
};
