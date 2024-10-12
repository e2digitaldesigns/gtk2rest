import mongoose from "mongoose";
import _sortBy from "lodash/sortBy";
import { EpisodeModel, IEpisode } from "../../../models/episodes.model";
import { sortEpisodeTopics, topicContentParser } from "../../_utils";
const ObjectId = mongoose.Types.ObjectId;

export const newEpisodeTopic = async (episodeId: string, userId: string) => {
  try {
    const topicId = new ObjectId();

    const episode: IEpisode | null = await EpisodeModel.findOne({
      _id: new ObjectId(episodeId),
      userId: new ObjectId(userId)
    }).select({
      topics: 1
    });

    const result = await EpisodeModel.findOneAndUpdate(
      {
        _id: new ObjectId(episodeId),
        userId: new ObjectId(userId)
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

    const updatedEpisode = await EpisodeModel.findOne({
      _id: new ObjectId(episodeId),
      userId: new ObjectId(userId)
    }).lean();

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {
        activeIndex: updatedEpisode?.topics.findIndex(f => String(f._id) === String(topicId)) || 0,
        topics: updatedEpisode?.topics
          ? sortEpisodeTopics(topicContentParser(updatedEpisode.topics))
          : []
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
