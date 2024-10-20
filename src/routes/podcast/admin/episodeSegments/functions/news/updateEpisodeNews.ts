import { EpisodeModel, IEpisodeTicker } from "../../../../../../models";
import { mongoObjectId } from "../../../../../../utils/routeUtils/mongoObjectId";

export const updateEpisodeNews = async (
  episodeId: string,
  userId: string,
  item: IEpisodeTicker
) => {
  try {
    await EpisodeModel.updateOne(
      {
        _id: mongoObjectId(episodeId),
        userId: mongoObjectId(userId),
        "ticker._id": item._id
      },
      {
        $set: {
          "ticker.$.title": item.title,
          "ticker.$.text": item.text
        }
      }
    );

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
