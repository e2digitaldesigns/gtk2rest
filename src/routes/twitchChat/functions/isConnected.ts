import { isChannelInClient } from "../../../bots/twitch";
import { TwitchAuthModel } from "../../../models";
import { mongoObjectId } from "../../../utils/routeUtils";

export const isConnected = async (userId: string) => {
  try {
    const user = await TwitchAuthModel.findOne({
      userId: mongoObjectId(userId)
    });

    const isConnected = user?.twitchUserName ? isChannelInClient(user.twitchUserName) : false;
    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {
        isConnected
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
