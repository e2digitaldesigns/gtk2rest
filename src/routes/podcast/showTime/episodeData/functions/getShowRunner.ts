import { EpisodeModel } from "../../../../../models";
import { mongoObjectId, sortEpisodeTopicWithContent } from "../../../../../utils";

export const getShowRunner = async (episodeId: string) => {
  try {
    const result = await EpisodeModel.findById(mongoObjectId(episodeId))
      .select({
        airDate: 1,
        logo: 1,
        name: 1,
        number: 1,
        podcastName: 1,
        topics: 1
      })
      .exec();

    let data = {};

    if (result) {
      const theResult = result.toObject();
      data = {
        _id: result._id,
        airDate: result.airDate,
        logo: result.logo,
        name: result.name,
        number: result.number,
        podcastName: result.podcastName,
        topics: !theResult?.topics ? [] : sortEpisodeTopicWithContent(theResult.topics)
      };
    }

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {
        episodeData: data
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
