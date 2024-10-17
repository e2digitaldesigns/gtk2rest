import _sortBy from "lodash/sortBy";
import { EpisodeModel, IEpisodeTopic } from "../../../../../models";
import { mongoObjectId } from "../../../../_routeUtils";
import { getUpdatedTopics } from "../../../_podcastUtils";

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
  await EpisodeModel.updateOne(
    {
      _id: mongoObjectId(episodeId),
      userId: mongoObjectId(userId),
      "topics._id": mongoObjectId(_id)
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
        _id: mongoObjectId(episodeId),
        userId: mongoObjectId(userId),
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

  const topics = await getUpdatedTopics(episodeId);
  const activeIndex = topics.findIndex(f => String(f._id) === String(_id)) || 0;

  try {
    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {
        activeIndex: activeIndex,
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
