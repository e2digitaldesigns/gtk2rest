import _sortBy from "lodash/sortBy";
import { EpisodeModel, IEpisode } from "../../../../../../models";
import { mongoObjectId } from "../../../../../_routeUtils";

export const updateEpisodeInformation = async (
  episodeId: string,
  userId: string,
  { airDate, current, name, number, podcastName, templateId }: Partial<IEpisode>
) => {
  try {
    const result = await EpisodeModel.findOneAndUpdate(
      {
        _id: mongoObjectId(episodeId),
        userId: mongoObjectId(userId)
      },
      {
        $set: {
          airDate,
          current,
          name,
          number,
          podcastName,
          templateId
        }
      }
    ).select({
      current: 1,
      templateId: 1
    });

    if (current && result?.templateId) {
      await EpisodeModel.updateMany(
        {
          _id: { $ne: result._id },
          templateId: result.templateId,
          userId: userId
        },
        {
          $set: {
            current: false
          }
        }
      );
    }

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {}
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
