import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

import { ChatLogModel } from "../../../models/chatLog.model";
import { sendChatData } from "./sendChatData";

export const deleteChatMessage = async (userId: string, messageId: string) => {
  try {
    const result = await ChatLogModel.updateOne(
      {
        _id: new ObjectId(messageId),
        gtkUserId: new ObjectId(userId)
      },
      { $set: { isDeleted: true } }
    );

    if (!result) {
      throw new Error("No chat message found");
    }

    sendChatData(userId);

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
