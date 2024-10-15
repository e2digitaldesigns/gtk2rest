import { ChatLogModel } from "../../../models";
import { sendChatRankData } from "./sendChatRankData";
import { mongoObjectId } from "../../_routeUtils";

export const resetChatRanks = async (userId: string) => {
  try {
    const result = await ChatLogModel.updateMany(
      {
        gtkUserId: mongoObjectId(userId)
      },
      {
        isRankReset: true
      }
    );

    sendChatRankData(userId);

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
