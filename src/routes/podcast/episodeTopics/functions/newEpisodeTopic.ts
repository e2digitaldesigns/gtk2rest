import _sortBy from "lodash/sortBy";
import { EpisodeModel, IEpisode } from "../../../../models/episodes.model";
import { mongoObjectId } from "../../../_routeUtils";
import { getUpdatedTopics } from "../../_podcastUtils";

export const newEpisodeTopic = async (episodeId: string, userId: string) => {
  try {
    const topicId = mongoObjectId();

    const episode: IEpisode | null = await EpisodeModel.findOne({
      _id: mongoObjectId(episodeId),
      userId: mongoObjectId(userId)
    }).select({
      topics: 1
    });

    const result = await EpisodeModel.findOneAndUpdate(
      {
        _id: mongoObjectId(episodeId),
        userId: mongoObjectId(userId)
      },
      {
        $push: {
          topics: {
            _id: topicId,
            desc: "Now, do it now!",
            name: "Change my name",
            order: (episode ? _sortBy(episode.topics, "order").reverse()[0].order : 0) + 1
          }
        }
      },
      {
        returnDocument: "after",
        projection: { topics: { $slice: -1 } }
      }
    );

    if (!result) {
      throw new Error("Failed to copy topic");
    }

    const topics = await getUpdatedTopics(episodeId);
    const activeIndex = topics.findIndex(f => String(f._id) === String(topicId)) || 0;

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {
        activeIndex,
        topics
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
