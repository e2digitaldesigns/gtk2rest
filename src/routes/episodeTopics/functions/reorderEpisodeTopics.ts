import { IEpisodeTopic } from "../../../models/episodes.model";
import mongoose from "mongoose";
import { EpisodeModel } from "../../../models/episodes.model";
import { sortEpisodeTopics, topicContentParser } from "../../_utils";
const ObjectId = mongoose.Types.ObjectId;

export const reorderEpisodeTopics = async (
  episodeId: string,
  topics: IEpisodeTopic[],
  userId: string
) => {
  try {
    const updatePromises = topics.map(topic => {
      return EpisodeModel.updateOne(
        {
          _id: new ObjectId(episodeId),
          userId: new ObjectId(userId),
          "topics._id": new ObjectId(topic._id)
        },
        { $set: { "topics.$.order": topic.order } }
      );
    });

    await Promise.all(updatePromises);

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
