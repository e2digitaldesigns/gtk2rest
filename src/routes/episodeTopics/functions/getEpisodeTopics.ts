import _sortBy from "lodash/sortBy";
import { EpisodeModel } from "../../../models/episodes.model";
import { mongoObjectId, sortEpisodeTopicWithContent } from "../../_routeUtils";

export const getEpisodeTopics = async (episodeId: string, userId: string) => {
  try {
    const result = await EpisodeModel.aggregate([
      {
        $match: {
          _id: mongoObjectId(episodeId),
          userId: mongoObjectId(userId)
        }
      },
      {
        $lookup: {
          from: "templates",
          localField: "templateId",
          foreignField: "_id",
          as: "template"
        }
      },
      {
        $project: {
          templateId: 1,
          topics: 1,
          "template.images": 1
        }
      }
    ]);

    const theTopics = result?.[0]?.topics ? sortEpisodeTopicWithContent(result[0].topics) : [];

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {
        activeTopic: theTopics[0],
        images: result[0].template[0].images.topic,
        templateId: result[0].templateId,
        topics: theTopics
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
