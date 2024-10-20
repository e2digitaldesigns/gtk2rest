import { SocialNetworkModel } from "../../../../../models/socialNetworks.model";
import { mongoObjectId } from "../../../../../utils/routeUtils";

export const deleteSocial = async (socialId: string, userId: string) => {
  try {
    await SocialNetworkModel.deleteOne({
      _id: mongoObjectId(socialId),
      userId: mongoObjectId(userId)
    });

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {
        deletedSoicalId: socialId
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
