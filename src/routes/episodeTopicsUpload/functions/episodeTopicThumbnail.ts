import { EpisodeModel } from "../../../models/episodes.model";
import {
  generateFileName,
  getTemplateImageSize,
  imageSizeParser,
  s3Functions
} from "../../../utils";
import { mongoObjectId } from "../../_routeUtils";

export const episodeTopicThumbnail = async (
  episodeId: string,
  file: Express.Multer.File,
  imageType: string,
  topicId: string,
  userId: string
) => {
  try {
    const { fileName } = generateFileName(file);
    if (!process.env.AWS_SECRET_S3_BUCKET) throw new Error("No AWS S3 Bucket");

    const { width, height } = await getTemplateImageSize(episodeId, userId, "topic");

    const data = await imageSizeParser(file, width, height);
    const s3Push = await s3Functions.push(data, `images/user-images/${fileName}`);
    if (!s3Push) throw new Error("S3 Push failed");
    const imageId = mongoObjectId() as unknown as string;

    const episodeTopics = await EpisodeModel.findOneAndUpdate(
      {
        _id: mongoObjectId(episodeId),
        "topics._id": mongoObjectId(topicId)
      },
      {
        $set: {
          "topics.$.img": fileName
        }
      },
      {
        returnOriginal: true,
        projection: { "topics.$": 1 }
      }
    );

    if (episodeTopics?.topics?.[0].img) {
      await s3Functions.delete(episodeTopics?.topics?.[0].img);
    }

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {
        imageId: imageType === "sponsors" ? imageId : null,
        type: imageType,
        fileName: fileName,
        url: process.env.S3_CLOUD_IMAGES + fileName
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
