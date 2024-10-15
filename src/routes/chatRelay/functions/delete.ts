import { ChatLogModel } from "../../../models";
import { sendChatData } from "./sendChatData";
import { mongoObjectId } from "../../_routeUtils";

export const deleteChatMessage = async (userId: string, messageId: string) => {
  try {
    const result = await ChatLogModel.updateOne(
      {
        _id: mongoObjectId(messageId),
        gtkUserId: mongoObjectId(userId)
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
