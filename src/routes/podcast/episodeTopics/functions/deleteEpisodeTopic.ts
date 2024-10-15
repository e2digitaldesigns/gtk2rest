import _sortBy from "lodash/sortBy";
import { EpisodeModel } from "../../../../models/episodes.model";
import { s3Functions } from "../../../../utils";
import { mongoObjectId } from "../../../_routeUtils";
import { getUpdatedTopics } from "../../_podcastUtils";

export const deleteEpisodeTopic = async (episodeId: string, topicId: string, userId: string) => {
  try {
    const documentBeforeUpdate = await EpisodeModel.findOne({
      _id: mongoObjectId(episodeId),
      userId: mongoObjectId(userId)
    }).select({
      topics: { $elemMatch: { _id: topicId } }
    });

    if (documentBeforeUpdate?.topics[0].img) {
      await s3Functions.delete(documentBeforeUpdate?.topics[0].img);
    }

    await EpisodeModel.updateMany(
      {
        _id: mongoObjectId(episodeId),
        userId: mongoObjectId(userId),
        "topics.parentId": topicId,
        "topics.isChild": true
      },
      {
        $set: {
          "topics.$[elem].isChild": false,
          "topics.$[elem].parentId": ""
        }
      },
      {
        arrayFilters: [{ "elem.isChild": true, "elem.parentId": topicId }]
      }
    );

    await EpisodeModel.updateOne(
      {
        _id: mongoObjectId(episodeId),
        userId: mongoObjectId(userId)
      },
      {
        $pull: { topics: { _id: topicId } }
      }
    );

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
