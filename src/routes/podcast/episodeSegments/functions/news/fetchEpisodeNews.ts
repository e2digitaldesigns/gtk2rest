import { EpisodeModel } from "../../../../../models/episodes.model";
import { mongoObjectId } from "../../../../_routeUtils/mongoObjectId";

export const fetchEpisodeNews = async (episodeId: string, userId: string) => {
  try {
    const episodeNews = await EpisodeModel.findOne({
      _id: mongoObjectId(episodeId),
      userId: mongoObjectId(userId)
    }).select({
      ticker: 1
    });

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {
        news: episodeNews?.ticker || {}
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
