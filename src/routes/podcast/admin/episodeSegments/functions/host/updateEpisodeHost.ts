import _sortBy from "lodash/sortBy";
import { EpisodeModel, IEpisodeHost } from "../../../../../../models";
import { mongoObjectId } from "../../../../../../utils/routeUtils";

export const updateEpisodeHost = async (
  episodeId: string,
  userId: string,
  episodeHosts: IEpisodeHost[]
) => {
  try {
    const result = await EpisodeModel.updateOne(
      {
        _id: mongoObjectId(episodeId),
        userId: mongoObjectId(userId)
      },
      { $set: { hosts: episodeHosts } }
    );

    if (!result.modifiedCount) {
      throw new Error("Failed to update episode hosts");
    }

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {
        episodeHosts
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
