import { EpisodeModel } from "../../../models/episodes.model";
import mongoose from "mongoose";
import { s3Functions } from "../../../utils";
const ObjectId = mongoose.Types.ObjectId;

export const episodeTopicContentDelete = async (
  episodeId: string,
  imageId: string,
  imageType: string
) => {
  let fileToDelete: string | undefined = "";
  let isImage = true;

  try {
    switch (imageType) {
      case "topic":
        const topicImageDelete = await EpisodeModel.findOneAndUpdate(
          {
            _id: new ObjectId(episodeId),
            "topics._id": new ObjectId(imageId as string)
          },
          {
            $set: {
              "topics.$.img": ""
            }
          }
        );

        fileToDelete = topicImageDelete?.topics?.find(f => f._id.toString() === imageId)?.img;
        break;

      case "content":
        const topicContentDelete = await EpisodeModel.findOneAndUpdate(
          {
            _id: new ObjectId(episodeId),
            "topics._id": new ObjectId(imageId as string)
          },
          {
            $set: {
              "topics.$.video": " ",
              "topics.$.content": { file: " ", type: null }
            }
          }
        );

        fileToDelete = topicContentDelete?.topics?.find(f => f._id.toString() === imageId)?.video;

        const ext = fileToDelete?.split(".").pop();
        isImage = ["jpg", "jpeg", "png", "svg", "webp"].includes(ext as string);
        break;

      default:
        break;
    }

    if (!process.env.AWS_SECRET_S3_BUCKET) {
      throw new Error("No AWS S3 Bucket");
    }
    if (fileToDelete) {
      s3Functions.delete(fileToDelete, isImage ? "images/user-images" : "videos/user-videos");
    }

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
