import mongoose from "mongoose";
import { EpisodeModel } from "../models/episodes.model";
const ObjectId = mongoose.Types.ObjectId;

export async function getTemplateImageSize(episodeId: string, userId: string, imageType: string) {
  const template = await EpisodeModel.aggregate([
    {
      $match: {
        _id: new ObjectId(episodeId),
        userId: new ObjectId(userId)
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
