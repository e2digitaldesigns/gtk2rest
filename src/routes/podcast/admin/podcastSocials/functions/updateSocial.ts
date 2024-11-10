import { SocialNetworkModel } from "../../../../../models/socialNetworks.model";
import { mongoObjectId } from "../../../../../utils/routeUtils";

export const updateSocial = async (userId: string, _id: string, site: string, username: string) => {
	try {
		const action = await SocialNetworkModel.findOneAndUpdate(
			{
				userId: mongoObjectId(userId),
				_id: mongoObjectId(_id)
			},
			{
				site,
				username
			}
		);

		return {
			resultStatus: {
				success: true,
				errors: null,
				responseCode: 200,
				resultMessage: "Your request was successful."
			},
			result: {
				_id: action?._id,
				site: action?.site,
				username: action?.username
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
