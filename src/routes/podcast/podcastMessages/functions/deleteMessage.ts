import { CannedMessageModel } from "../../../../models";
import { mongoObjectId } from "../../../_routeUtils";

export const deleteMessage = async (userId: string, messageId: string) => {
  try {
    await CannedMessageModel.deleteOne({
      _id: mongoObjectId(messageId),
      userId: mongoObjectId(userId)
    });

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
