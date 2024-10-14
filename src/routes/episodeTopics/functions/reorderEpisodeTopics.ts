import { IEpisodeTopic } from "../../../models/episodes.model";
import { EpisodeModel } from "../../../models/episodes.model";
import { getUpdatedTopics, mongoObjectId } from "../../_routeUtils";

export const reorderEpisodeTopics = async (
  episodeId: string,
  topics: IEpisodeTopic[],
  userId: string
) => {
  try {
    const updatePromises = topics.map(topic => {
      return EpisodeModel.updateOne(
        {
          _id: mongoObjectId(episodeId),
          userId: mongoObjectId(userId),
          "topics._id": mongoObjectId(topic._id)
        },
        { $set: { "topics.$.order": topic.order } }
      );
    });

    await Promise.all(updatePromises);

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {
        topics: await getUpdatedTopics(episodeId)
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
