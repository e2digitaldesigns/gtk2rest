import _sortBy from "lodash/sortBy";
import { EpisodeModel } from "../../../../../../models";
import { mongoObjectId } from "../../../../../_routeUtils";

export const fetchEpisodeInformation = async (episodeId: string, userId: string) => {
  const result = await EpisodeModel.aggregate([
    {
      $match: {
        userId: mongoObjectId(userId),
        _id: mongoObjectId(episodeId)
      }
    },
    {
      $lookup: {
        from: "templates",
        localField: "templateId",
        foreignField: "_id",
        as: "template"
      }
    },
    {
      $project: {
        podcastName: 1,
        name: 1,
        number: 1,
        airDate: 1,
        current: 1,
        templateId: 1,
        "template.name": 1
      }
    }
  ]);

  const data = {
    podcastName: result[0].podcastName,
    name: result[0].name,
    number: result[0].number,
    airDate: result[0].airDate,
    current: result[0].current,
    templateId: result[0].templateId,
    templateName: result[0].template[0].name
  };

  try {
    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {
        ...data
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
