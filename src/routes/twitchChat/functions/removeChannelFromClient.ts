import { removeChannel, isChannelInClient } from "../../../bots/twitch";
import { TwitchAuthModel } from "../../../models";
import { mongoObjectId } from "../../../utils/routeUtils";

export const removeChannelFromClient = async (userId: string) => {
  try {
    const user = await TwitchAuthModel.findOneAndDelete({
      userId: mongoObjectId(userId)
    });

    if (!user?.twitchUserName) {
      throw new Error("User not found.");
    }

    await removeChannel(user.twitchUserName);

    await new Promise(resolve => setTimeout(resolve, 1000));
    const isRemoved = await isChannelInClient(user.twitchUserName);

    if (isRemoved) {
      throw new Error("Channel was not removed.");
    }

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {}
    };
  } catch (error: any) {
    return {
      resultStatus: {
        success: false,
        errors: error.message || error,
        responseCode: 400,
        resultMessage: "Your request failed."
      }
    };
  }
};
