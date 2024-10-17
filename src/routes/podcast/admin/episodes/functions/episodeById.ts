import { EpisodeModel } from "../../../../../models";
import { mongoObjectId } from "../../../../_routeUtils";
import {
  sortEpisodeTopicWithContent,
  sponsorImageParser,
  logoImageParser
} from "../../../_podcastUtils";

export const episodeById = async (episodeId: string, userId: string) => {
  try {
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
      }
    ]);

    const { template, ...episode } = result[0];

    const episodeData = {
      ...episode,
      host: [],
      logo: logoImageParser(episode.logo),
      sponsorImages: sponsorImageParser(episode.sponsorImages),
      topics: sortEpisodeTopicWithContent(episode.topics)
    };

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {
        template: template?.[0],
        episode: episodeData
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
