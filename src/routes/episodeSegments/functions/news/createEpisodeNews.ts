import { EpisodeModel, IEpisodeTicker } from "../../../../models/episodes.model";
import { mongoObjectId } from "./../../../_routeUtils/mongoObjectId";

export const createEpisodeNews = async (
  episodeId: string,
  userId: string,
  item: IEpisodeTicker
) => {
  try {
    const result = await EpisodeModel.updateOne(
      {
        _id: mongoObjectId(episodeId),
        userId: mongoObjectId(userId)
      },
      {
        $push: { ticker: item }
      }
    );

    if (!result.modifiedCount) {
      throw new Error("No document was updated.");
    }

    const updatedNews = await EpisodeModel.findOne({
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
        news: updatedNews?.ticker || {}
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
