import { EpisodeModel } from "../../../../../models/episodes.model";
import { ISocialNetworks } from "../../../../../models/socialNetworks.model";
import { mongoObjectId } from "../../../../_routeUtils/mongoObjectId";

export const updateEpisodeSocials = async (
  episodeId: string,
  userId: string,
  episodeSocials: ISocialNetworks
) => {
  await EpisodeModel.updateOne(
    {
      _id: mongoObjectId(episodeId),
      userId: mongoObjectId(userId)
    },
    { $set: { socialNetworks: episodeSocials } }
  );

  const updatedSocials = await EpisodeModel.findOne({
    _id: mongoObjectId(episodeId),
    userId: mongoObjectId(userId)
  }).select({
    __v: 0
  });

  try {
    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {
        episodeSocials: updatedSocials?.socialNetworks || []
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
