import { TemplateModel } from "../../../../models";

export const getTemplates = async () => {
	try {
		const templates = await TemplateModel.find({ active: true }).select({
			name: 1
		});

		return {
			resultStatus: {
				success: true,
				errors: null,
				responseCode: 200,
				resultMessage: "Your request was successful."
			},
			result: {
				templates
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
