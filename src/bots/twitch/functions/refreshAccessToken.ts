import axios from "axios";
import { GtkTwitchBotModel } from "../../../models/gtkBot.model";

export async function refreshAccessToken(refreshToken: string = ""): Promise<any> {
  try {
    if (!refreshToken) {
      const botData = await GtkTwitchBotModel.findOne().select({
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
      console.log("Refresh Access Token: Twitch Refresh Failed");
      return "";
    }

    await GtkTwitchBotModel.findOneAndUpdate(
      {},
      {
        $set: {
          refreshToken: response.data.refresh_token,
          accessToken: response.data.access_token,
          expiresIn: response.data.expires_in,
          expirationTime: Date.now() + response.data.expires_in * 1000,
          obtainmentTimestamp: Date.now()
        }
      },
      { new: true }
    );

    return {
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
      obtainmentTimestamp: response.data.obtainmentTimestamp,
      accessToken: response.data.access_token
    };
  } catch (error) {
    return undefined;
  }
}
