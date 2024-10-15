import { EpisodeModel } from "../../../../models/episodes.model";
import { s3Functions } from "../../../../utils";
import { mongoObjectId } from "../../../_routeUtils";
import { getUpdatedTopics } from "../../_podcastUtils";

export const episodeTopicContentDelete = async (
  episodeId: string,
  topicId: string,
  type: string
) => {
  let fileToDelete: string | undefined = "";
  let isImage = true;

  try {
    switch (type) {
      case "topic":
        const topicImageDelete = await EpisodeModel.findOneAndUpdate(
          {
            _id: mongoObjectId(episodeId),
            "topics._id": mongoObjectId(topicId as string)
          },
          {
            $set: {
              "topics.$.img": ""
            }
          }
        );

        fileToDelete = topicImageDelete?.topics?.find(f => f._id.toString() === topicId)?.img;
        break;

      case "content":
        const topicContentDelete = await EpisodeModel.findOneAndUpdate(
          {
            _id: mongoObjectId(episodeId),
            "topics._id": mongoObjectId(topicId as string)
          },
          {
            $set: {
              "topics.$.video": " ",
              "topics.$.content": { file: " ", type: null }
            }
          }
        );

        fileToDelete = topicContentDelete?.topics?.find(f => f._id.toString() === topicId)?.video;

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
      result: {
        topics: await getUpdatedTopics(episodeId),
        type,
        updatedTopicId: topicId,
        url: ""
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
