import { TwitchAuthModel } from "../../../models";
import { mongoObjectId } from "../../../utils/routeUtils";

export const getTwitchUsername = async (userId: string) => {
  try {
    const twitchUser = await TwitchAuthModel.findOne({
      userId: mongoObjectId(userId)
    }).select("twitchUserName");

    if (!twitchUser?.twitchUserName) throw new Error("No Twitch Username");

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {
        twitchUsername: twitchUser.twitchUserName
      }
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
