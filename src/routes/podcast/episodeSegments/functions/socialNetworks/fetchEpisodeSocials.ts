import { EpisodeModel, SocialNetworkModel } from "../../../../../models";
import { mongoObjectId } from "../../../../_routeUtils/mongoObjectId";
import _sortBy from "lodash/sortBy";

export const fetchEpisodeSocials = async (episodeId: string, userId: string) => {
  const availableSocials = await SocialNetworkModel.find({
    userId: userId
  }).select({
    __v: 0,
    socials: 0
  });

  const episodeSocials = await EpisodeModel.findOne({
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
        availableSocials: availableSocials ? _sortBy(availableSocials, "site") : [],
        episodeSocials: episodeSocials?.socialNetworks || []
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
