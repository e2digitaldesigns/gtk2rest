import { UserTemplateModel } from "../../../../models";
import { mongoObjectId } from "utils";

export const changeUserTemplate = async (userId: string, templateId: string) => {
  try {
    if (!userId || !templateId) {
      throw new Error("Missing userId or templateId");
    }

    const result = await UserTemplateModel.updateOne(
      {
        userId: mongoObjectId(userId)
      },
      { templateId: mongoObjectId(templateId) },
      {
        upsert: true
      }
    );

    if (!result) {
      throw new Error("No template found for this user");
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
