import { IEpisodeTopic } from "../../../models/episodes.model";
import mongoose from "mongoose";
import { EpisodeModel } from "../../../models/episodes.model";
const ObjectId = mongoose.Types.ObjectId;

export const reorderEpisodeTopics = async (
  episodeId: string,
  topics: IEpisodeTopic[],
  userId: string
) => {
  try {
    for (let i = 0; i < topics.length; i++) {
      await EpisodeModel.updateOne(
        {
          _id: new ObjectId(episodeId),
          userId: new ObjectId(userId),
          "topics._id": new ObjectId(topics[i]._id)
        },
        { $set: { "topics.$.order": topics[i].order } }
      );
    }

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: true
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
