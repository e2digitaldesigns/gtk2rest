import { EpisodeModel } from "../../../../../../models";
import { episodeImageParser, mongoObjectId } from "../../../../../../utils";

export const fetchEpisodeImages = async (episodeId: string, userId: string) => {
  const result = await EpisodeModel.aggregate([
    {
      $match: {
        _id: mongoObjectId(episodeId),
        userId: mongoObjectId(userId)
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
        "template.name": 1,
        "template._id": 1,
        "template.images": 1,
        logo: 1,
        sponsorImages: 1
      }
    }
  ]);

  if (!result[0]) {
    throw new Error("No episode found.");
  }

  try {
    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {
        logo: result[0]?.logo ? episodeImageParser(result[0].logo) : "",
        sponsorImages: result[0]?.sponsorImages ? episodeImageParser(result[0].sponsorImages) : [],
        templateImages: result[0].template[0].images
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
