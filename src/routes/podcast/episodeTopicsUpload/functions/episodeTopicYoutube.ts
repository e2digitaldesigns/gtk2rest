import axios from "axios";
import { EpisodeModel } from "../../../../models/episodes.model";
import { s3Functions } from "../../../../utils";
import { mongoObjectId } from "../../../_routeUtils";
import { getUpdatedTopics } from "../../_podcastUtils";

export const episodeTopicYoutube = async (episodeId: string, topicId: string, videoUrl: string) => {
  try {
    const { data } = await axios.post(
      "https://a7zjx8u1lf.execute-api.us-east-1.amazonaws.com/prod/video",
      {
        topicId,
        videoUrl
      }
    );

    const { fileLocation, fileName } = data.result;

    if (!fileLocation) {
      throw new Error("Video not found");
    }

    const episode = await EpisodeModel.findOneAndUpdate(
      {
        _id: mongoObjectId(episodeId),
        "topics._id": mongoObjectId(topicId)
      },
      {
        $set: {
          "topics.$.video": fileName,
          "topics.$.content": {
            file: fileName,
            type: "video"
          }
        }
      },
      {
        returnNewDocument: true
      }
    );

    const currentTopic = episode?.topics?.find((topic: any) => topic._id.toString() === topicId);

    if (currentTopic?.video) {
      await s3Functions.deleteMulti(
        [currentTopic.video.split("/").pop() as string],
        "videos/user-videos"
      );
    }

    return {
      resultStatus: {
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful.",
        success: true
      },
      result: {
        url: fileLocation,
        fileName,
        topics: await getUpdatedTopics(episodeId),
        type: "video",
        updatedTopicId: topicId
      }
    };
  } catch (error) {
    return {
      resultStatus: {
        error: error instanceof Error ? error.message : "Unknown error",
        responseCode: 400,
        resultMessage: "Your request failed.",
        success: false
      },
      result: null
    };
  }
};
