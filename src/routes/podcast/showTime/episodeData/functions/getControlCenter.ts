import { EpisodeModel } from "../../../../../models";
import { mongoObjectId } from "../../../../_routeUtils";
import { sortEpisodeTopicWithContent } from "../../../_podcastUtils";

export const getControlCenter = async (userId: string, templateId: string) => {
  try {
    const result = await EpisodeModel.aggregate([
      {
        $match: {
          templateId: mongoObjectId(templateId),
          userId: mongoObjectId(userId),
          current: true
        }
      },
      {
        $lookup: {
          from: "hosts",
          localField: "userId",
          foreignField: "userId",
          as: "availableHosts"
        }
      },
      {
        $project: {
          __v: 0
        }
      }
    ]);

    const epData = result[0];

    const data = {
      _id: epData._id,
      airDate: epData.airDate,
      logo: epData.logo,
      name: epData.name,
      number: epData.number,
      podcastName: epData.podcastName,
      topics: !epData?.topics ? [] : sortEpisodeTopicWithContent(epData.topics)
    };

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {
        episodeData: data
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
