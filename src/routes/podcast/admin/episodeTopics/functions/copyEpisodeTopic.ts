import _sortBy from "lodash/sortBy";
import { EpisodeModel } from "../../../../../models";
import { mongoObjectId, sortEpisodeTopicWithContent } from "../../../../../utils";

export const copyEpisodeTopics = async (episodeId: string, topicId: string, userId: string) => {
  try {
    const episode = await EpisodeModel.aggregate([
      {
        $match: {
          _id: mongoObjectId(episodeId),
          userId: mongoObjectId(userId)
        }
      },
      {
        $project: {
          topics: {
            $filter: {
              input: "$topics",
              as: "topic",
              cond: { $eq: ["$$topic._id", mongoObjectId(topicId)] }
            }
          },
          totalTopics: { $size: "$topics" }
        }
      }
    ]);

    const originalTopic = episode[0].topics[0];

    if (!originalTopic) {
      throw new Error("Topic not found");
    }

    const newTopic = {
      _id: mongoObjectId(),
      desc: originalTopic.desc,
      img: "",
      isChild: originalTopic.isChild,
      isParent: false,
      name: originalTopic.name,
      order: 999,
      parentId: originalTopic.parentId,
      timer: originalTopic.timer,
      articles: originalTopic.articles,
      video: "",
      notes: originalTopic.notes,
      chat: originalTopic.chat,
      voting: originalTopic.voting
    };

    const result = await EpisodeModel.findOneAndUpdate(
      {
        _id: mongoObjectId(episodeId),
        userId: mongoObjectId(userId)
      },
      {
        $push: {
          topics: newTopic
        }
      },
      {
        returnDocument: "after",
        projection: { topics: 1 }
      }
    ).lean();

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
      result: {
        activeIndex: result.topics.length - 1,
        topics: sortEpisodeTopicWithContent(result.topics)
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
