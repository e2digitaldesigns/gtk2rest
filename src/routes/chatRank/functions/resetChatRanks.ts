import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
import { ChatLogModel } from "../../../models/chatLog.model";
import { sendChatRankData } from "./sendChatRankData";

export const resetChatRanks = async (userId: string) => {
  try {
    const result = await ChatLogModel.updateMany(
      {
        gtkUserId: new ObjectId(userId)
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
