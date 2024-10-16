import axios from "axios";
import { addChannel, isChannelInClient } from "../../../bots/twitch";
import { TwitchAuthModel } from "../../../models";
import { mongoObjectId } from "../../_routeUtils";

type TwitchData = {
  access_token: string;
  refresh_token: string;
  scope: string;
  expires_in: number;
};

export const addChannelToClient = async (userId: string, twitchData: TwitchData) => {
  let isInClient = false;

  try {
    const { data: userData } = await axios.get("https://api.twitch.tv/helix/users", {
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${twitchData.access_token}`
      }
    });

    const tokenData = {
      accessToken: twitchData.access_token,
      refreshToken: twitchData.refresh_token,
      scope: twitchData.scope,
      expiresIn: twitchData.expires_in,
      obtainmentTimestamp: 0,
      twitchUserName: userData.data[0].login,
      twitchUserId: userData.data[0].id
    };

    await TwitchAuthModel.findOneAndUpdate(
      {
        userId: mongoObjectId(userId)
      },
      {
        ...tokenData
      },
      { upsert: true }
    );

    const isConnected = await isChannelInClient(userData.data[0].login);

    if (!isConnected) {
      isInClient = await addChannel(userData.data[0].login);
    }

    if (!isInClient) throw new Error("Failed to connect to Twitch.");

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {}
    };
  } catch (error) {
    return {
      resultStatus: {
        success: false,
        errors: error,
        responseCode: 400,
        resultMessage: "Your request failed."
      }
    };
  }
};
