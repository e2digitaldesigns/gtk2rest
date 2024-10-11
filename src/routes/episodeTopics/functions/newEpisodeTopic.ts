import mongoose from "mongoose";
import _sortBy from "lodash/sortBy";
import { EpisodeModel, IEpisode } from "../../../models/episodes.model";
const ObjectId = mongoose.Types.ObjectId;

export const newEpisodeTopic = async (episodeId: string, topicId: string, userId: string) => {
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
            order: episode?.topics?.length ? episode.topics.length + 1 : 0
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

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: result.topics[0]
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
