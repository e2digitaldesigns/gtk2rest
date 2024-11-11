import { EpisodeModel, SponsorImages } from "../../../../../../models";
import { episodeImageParser, mongoObjectId, s3Functions } from "../../../../../../utils";

export const deleteEpisodeImage = async (
	episodeId: string,
	userId: string,
	imageId: string,
	type: string
) => {
	try {
		let fileToDelete: string | undefined = "";
		let images: SponsorImages[] | string | null = null;

		switch (type) {
			case "logo":
				const topicLogoDelete = await EpisodeModel.findOneAndUpdate(
					{ _id: mongoObjectId(episodeId), userId: mongoObjectId(userId) },
					{ logo: "" }
				);

				fileToDelete = topicLogoDelete?.logo;
				break;

			case "sponsors":
				const topicSponsorDelete = await EpisodeModel.findOneAndUpdate(
					{ _id: mongoObjectId(episodeId), userId: mongoObjectId(userId) },
					{
						$pull: {
							sponsorImages: { _id: mongoObjectId(imageId) }
						}
					}
				);

				fileToDelete = topicSponsorDelete?.sponsorImages?.find(
					f => f._id.toString() === imageId
				)?.url;
				break;

			default:
				break;
		}

		if (fileToDelete) {
			await s3Functions.delete(fileToDelete);
		}

		const newImages = await EpisodeModel.findOne({
			_id: mongoObjectId(episodeId),
			userId: mongoObjectId(userId)
		}).select({ logo: 1, sponsorImages: 1 });

		images =
			type === "logo"
				? ""
				: (episodeImageParser(
						newImages?.toObject().sponsorImages as SponsorImages[]
				  ) as SponsorImages[]);

		return {
			resultStatus: {
				success: true,
				errors: null,
				responseCode: 200,
				resultMessage: "Your request was successful."
			},
			result: {
				imageType: type,
				images
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
