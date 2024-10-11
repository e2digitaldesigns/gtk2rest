import mongoose from "mongoose";
import _sortBy from "lodash/sortBy";
import { EpisodeModel, IEpisodeTopic } from "../../../models/episodes.model";
const ObjectId = mongoose.Types.ObjectId;

export const updateEpisodeTopics = async (
  {
    _id,
    articles,
    chat,
    desc,
    isChild,
    isParent,
    name,
    notes,
    parentId,
    timer,
    voting
  }: IEpisodeTopic,
  episodeId: string,
  userId: string
) => {
  const result = await EpisodeModel.updateOne(
    {
      _id: new ObjectId(episodeId),
      userId: new ObjectId(userId),
      "topics._id": new ObjectId(_id)
    },
    {
      $set: {
        "topics.$.desc": desc,
        "topics.$.isChild": isChild,
        "topics.$.isParent": isParent,
        "topics.$.name": name,
        "topics.$.parentId": parentId,
        "topics.$.timer": timer,
        "topics.$.articles": articles,
        "topics.$.notes": notes,
        "topics.$.chat": chat,
        "topics.$.voting": voting
      }
    }
  );

  if (!isParent) {
    await EpisodeModel.updateMany(
      {
        _id: new ObjectId(episodeId),
        userId: new ObjectId(userId),
        "topics.parentId": _id,
        "topics.isChild": true
      },
      {
        $set: {
          "topics.$[elem].isChild": false,
          "topics.$[elem].parentId": ""
        }
      },
      {
        arrayFilters: [{ "elem.isChild": true, "elem.parentId": _id }]
      }
    );
  }

  try {
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
