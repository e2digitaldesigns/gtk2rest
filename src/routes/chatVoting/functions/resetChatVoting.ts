import { ChatVotingModel } from "../../../models";
import { mongoObjectId } from "../../_routeUtils";
import { sendChatVotingData } from "./sendChatVotingData";

export const resetChatVoting = async (userId: string) => {
  try {
    await ChatVotingModel.updateMany({ gtkUserId: mongoObjectId(userId) }, { isDeleted: true });

    sendChatVotingData(userId);

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
