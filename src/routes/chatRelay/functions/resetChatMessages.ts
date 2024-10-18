import { ChatLogModel } from "../../../models";
import { sendChatData } from "./sendChatData";
import { mongoObjectId } from "../../_routeUtils";

export const resetChatMessages = async (userId: string) => {
  try {
    const result = await ChatLogModel.updateMany(
      { gtkUserId: mongoObjectId(userId) },
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
