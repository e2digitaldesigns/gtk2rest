import { Client as TMIClient } from "@twurple/auth-tmi";
import * as botFunctions from "./functions";

let twitchClient: TMIClient | null = null;
let isReconnecting = false;

const { StaticAuthProvider } = require("@twurple/auth");

export const twitch = async () => {
  try {
    twitchClient = new TMIClient({
      authProvider: new StaticAuthProvider(
        process.env.TWITCH_CLIENT_ID,
        await botFunctions.refreshAccessToken()
      ),
      channels: [...(await botFunctions.getTwitchChannels())],
      connection: {
        secure: true,
        reconnect: true,
        maxReconnectAttempts: Infinity,
        reconnectInterval: 2000
      },
      options: { debug: true }
    });

    twitchClientListener();
    return twitchClient;
  } catch (error) {
    console.error("Twitch bot initialization failed:", error);
  }
};

export const twitchClientReconnect = async () => {
  if (twitchClient && !isReconnecting) {
    isReconnecting = true;

    console.log(32, twitchClient.readyState());
    console.log(33, "Attempting to reconnect to Twitch...");

    try {
      if (twitchClient.readyState() === "OPEN") {
        console.log(37, "Twitch bot is already connected.");
        await twitchClient.disconnect();
        isReconnecting = false;
        return;
      }

      // await botFunctions.getValidAccessTokenMain();
      console.log(43, "Reconnecting to Twitch...");
      await twitchClient.connect();
    } catch (error) {
      console.error("Reconnection failed:", error);
    } finally {
      isReconnecting = false;
    }
  }
};

const disconnectTwitchClient = async () => {
  if (twitchClient) {
    await twitchClient.disconnect();
  }
};

export const twitchClientListener = () => {
  twitchClient?.connect().catch(err => {
    console.error("Failed to connect to Twitch:", err);
  });

  twitchClient?.on("message", (channel: string, tags: any, message: string, self: boolean) => {
    if (self) return;

    if (message === "!disco" && tags.username === "icon33") {
      twitchClient?.say(channel, "Command Accepted!");
      disconnectTwitchClient();
    }

    if (message === "!ping") {
      twitchClient?.say(channel, "Pongy!");
    }
  });

  twitchClient?.on("connected", (address: string, port: number) => {
    console.log(`Connected to ${address}:${port}`);
  });

  twitchClient?.on("disconnected", async (reason: string) => {
    console.log(76, `Disconnected: ${reason}`);

    setTimeout(() => {
      twitchClientReconnect();
    }, 5000);
  });
};

export const getTwitchClient = (): TMIClient => {
  if (!twitchClient) {
    throw new Error("Twitch bot has not been initialized yet.");
  }
  return twitchClient;
};
