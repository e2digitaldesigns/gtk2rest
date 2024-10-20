import { EpisodeModel } from "../../../../../../models";
import { mongoObjectId } from "../../../../../../utils/routeUtils/mongoObjectId";

export const deleteEpisodeNews = async (episodeId: string, tickerId: string, userId: string) => {
  try {
    const result = await EpisodeModel.updateOne(
      {
        _id: mongoObjectId(episodeId),
        userId: mongoObjectId(userId)
      },
      {
        $pull: { ticker: { _id: tickerId } }
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
        news: updatedNews?.ticker || []
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
