import { SocialNetworkModel } from "../../../../../models/socialNetworks.model";
import { mongoObjectId } from "../../../../../utils/routeUtils";

export const createSocial = async (userId: string, site: string, username: string) => {
  try {
    const action = await SocialNetworkModel.create({
      userId: mongoObjectId(userId),
      site,
      username
    });

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {
        _id: action._id,
        site: action.site,
        username: action.username
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
