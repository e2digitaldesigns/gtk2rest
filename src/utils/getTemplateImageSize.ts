import { EpisodeModel } from "../models/episodes.model";
import { mongoObjectId } from "../routes/_routeUtils";

export async function getTemplateImageSize(episodeId: string, userId: string, imageType: string) {
  const template = await EpisodeModel.aggregate([
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
      $unwind: "$template"
    },
    {
      $project: {
        "template.images": 1
      }
    },
    {
      $limit: 1
    }
  ]);

  const { width, height } = template[0].template.images[imageType];
  return { width, height };
}
