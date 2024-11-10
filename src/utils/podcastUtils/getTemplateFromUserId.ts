import { UserTemplateModel } from "../../models";
import { mongoObjectId } from "utils";

export const getTemplateFromUserId = async (userId: string) => {
	console.log("getTemplateFromUserId", "userId", userId);
	try {
		if (!userId) {
			throw new Error("Missing userId");
		}

		const result = await UserTemplateModel.findOne({ userId: mongoObjectId(userId) }).lean();

		console.log("getTemplateFromUserId", "result", result);

		if (!result?.templateId) {
			throw new Error("No template found for this user");
		}

		return result.templateId;
	} catch (error) {
		return undefined;
	}
};
