import { CannedMessageModel } from "../../../../../models";
import { mongoObjectId } from "../../../../../utils/routeUtils";

export const fetchMessages = async (userId: string) => {
  try {
    const result = await CannedMessageModel.find({ userId: mongoObjectId(userId) });

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {
        messages: result
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
