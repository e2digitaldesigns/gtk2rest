import { Client as TMIClient } from "tmi.js";
import * as botFunctions from "./functions";

let twitchClient: TMIClient | null = null;

export const twitch = async () => {
  if (twitchClient && twitchClient.readyState() === "OPEN") {
    console.log("Twitch bot is already connected.");
    return;
  }

  try {
    twitchClient = new TMIClient({
      channels: [...(await botFunctions.getTwitchChannels())],
      connection: {
        secure: true,
        reconnect: true,
        maxReconnectAttempts: Infinity,
        reconnectInterval: 2000
      },
      identity: {
        username: "iconicbotty",
        password: await botFunctions.refreshAccessToken("iconicbotty")
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
  if (twitchClient) {
    try {
      twitchClient.readyState() === "OPEN" && (await twitchClient.disconnect());
      console.log("Reconnecting to Twitch...");
      await twitchClient.connect();
    } catch (error) {
      console.error("Reconnection failed:", error);
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
    console.log(`${tags["display-name"]}: ${message}`);

    if (message === "!disco" && tags.username === "icon33") {
      twitchClient?.say(channel, "Command Accepted!");
      disconnectTwitchClient();
    }

    if (message === "!ping") {
      twitchClient?.say(channel, "Pong!");
    }
  });

  twitchClient?.on("connected", (address: string, port: number) => {
    console.log(`Connected to ${address}:${port}`);
  });

  twitchClient?.on("disconnected", async (reason: string) => {
    console.log(`Disconnected: ${reason}`);

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
