import { EpisodeModel } from "../../../../../models";
import {
  episodeImageParser,
  mongoObjectId,
  showTimeHostParser,
  showTimeImageParser,
  socialNetworkParser,
  sortEpisodeTopicWithContent
} from "../../../../../utils";

export const getEpisode = async (userId: string, type: "episode" | "template", dataId: string) => {
  const match =
    type === "episode"
      ? {
          _id: mongoObjectId(dataId)
        }
      : {
          current: true,
          templateId: mongoObjectId(dataId)
        };

  try {
    const data = await EpisodeModel.aggregate([
      {
        $match: {
          userId: mongoObjectId(userId),
          ...match
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
        $lookup: {
          from: "socials",
          localField: "userId",
          foreignField: "userId",
          as: "databaseSocials"
        }
      }
    ]);

    const epData = data[0];

    const result = {
      ...epData,
      logo: episodeImageParser(epData.logo),
      hosts: showTimeHostParser(epData.availableHosts, epData.hosts),
      sponsorImages: showTimeImageParser(epData.sponsorImages),
      socialNetworks: socialNetworkParser(epData.databaseSocials, epData.socialNetworks),
      topics: epData?.topics ? sortEpisodeTopicWithContent(epData.topics) : []
    };

    delete result.availableHosts;
    delete result.databaseSocials;

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {
        episodeData: result
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
