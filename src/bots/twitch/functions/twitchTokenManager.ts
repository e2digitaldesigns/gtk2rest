import axios from "axios";
import { GtkTwitchBotModel } from "../../../models/gtkBot.model";

const botName = "iconicbotty";

export async function refreshAccessToken(refreshToken: string = ""): Promise<string> {
  try {
    if (!refreshToken) {
      const botData = await GtkTwitchBotModel.findOne({ twitchUserName: botName }).select({
        refreshToken: 1
      });

      if (botData?.refreshToken) {
        refreshToken = botData.refreshToken;
      }
    }

    const response = await axios.post(
      `https://id.twitch.tv/oauth2/token?grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}`
    );

    if (response.status !== 200) {
      console.error("Refresh Access Token: Twitch Refresh Failed");
      return "";
    }

    console.log("Twitch token refreshed:", response.data);

    await GtkTwitchBotModel.findOneAndUpdate(
      {
        twitchUserName: botName
      },
      {
        $set: {
          refreshToken: response.data.refresh_token,
          accessToken: response.data.access_token,
          expiresIn: response.data.expires_in,
          expirationTime: Date.now() + response.data.expires_in * 1000
        }
      },
      { new: true }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return "";
  }
}

async function getValidAccessToken(): Promise<string> {
  const botData = await GtkTwitchBotModel.findOne({ twitchUserName: botName }).select({
    accessToken: 1,
    refreshToken: 1,
    expirationTime: 1
  });

  if (!botData) {
    throw new Error(`Bot data for ${botName} not found.`);
  }

  const currentTime = Date.now();
  if (currentTime >= botData.expirationTime - 5 * 60 * 1000 || !botData.accessToken) {
    console.log("Access token is expired or expiring soon. Refreshing token...");
    const newAccessToken = await refreshAccessToken(botData.refreshToken);
    if (!newAccessToken) {
      throw new Error("Failed to refresh access token.");
    }
    return newAccessToken;
  }

  return botData.accessToken;
}

export async function getValidAccessTokenMain(): Promise<string> {
  try {
    const accessToken = await getValidAccessToken();
    console.log(`Valid access token: ${accessToken}`);
    return accessToken;
  } catch (error) {
    console.error("Failed to retrieve valid access token:", error);
    throw error;
  }
}

export async function autoRefreshAccessToken() {
  setInterval(async () => {
    await getValidAccessTokenMain();
  }, 4 * 60 * 1000);
}
