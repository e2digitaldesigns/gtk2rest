import { EpisodeModel, SponsorImages } from "../../../../../models";
import { s3Functions } from "../../../../../utils";
import { lastEpisodeTopicParser } from "../../../_podcastUtils";
import { mongoObjectId } from "../../../../_routeUtils";

export const episodeCreate = async (
  currentState: Record<string, boolean>,
  episodeName: string,
  templateId: string,
  userId: string
) => {
  const newSponsorImages: SponsorImages[] = [];
  const isCurrentState = Object.values(currentState).some(value => value);

  try {
    const lastEpisode = isCurrentState
      ? await EpisodeModel.findOne({
          templateId,
          current: true,
          userId: mongoObjectId(userId)
        }).select({
          logo: 1,
          hosts: 1,
          number: 1,
          podcastName: 1,
          socialNetworks: 1,
          sponsorImages: 1,
          ticker: 1,
          topics: 1
        })
      : null;

    if (currentState?.sponsors && lastEpisode?.sponsorImages) {
      const copyPromises = lastEpisode.sponsorImages.map(async (item: SponsorImages) => {
        const newItem = await s3Functions.copy(item.url);

        return newItem
          ? {
              _id: mongoObjectId(),
              url: newItem
            }
          : null;
      });

      const results = await Promise.all(copyPromises);

      results.forEach(result => {
        if (result) {
          newSponsorImages.push(result);
        }
      });
    }

    const episode = {
      userId: mongoObjectId(userId),
      name: episodeName,
      active: false,
      current: lastEpisode ? false : true,
      hosts: currentState.hosts && lastEpisode?.hosts ? lastEpisode.hosts : [],
      logo: currentState.logo && lastEpisode?.logo ? await s3Functions.copy(lastEpisode.logo) : "",
      number: lastEpisode?.number ? Number(lastEpisode.number) + 1 : 1,
      socialNetworks:
        currentState.socialNetworks && lastEpisode?.socialNetworks
          ? lastEpisode?.socialNetworks
          : [],
      templateId,
      ticker: currentState.news && lastEpisode?.ticker ? lastEpisode.ticker : [],
      topics: await lastEpisodeTopicParser(currentState.topics, lastEpisode?.topics),
      contentBoxes: [],
      sponsorBoxes: [],
      sponsorImages: newSponsorImages,
      podcastName:
        currentState.podcastName && lastEpisode?.podcastName
          ? lastEpisode.podcastName
          : "My Next Episode"
    };

    const result = await EpisodeModel.create({
      ...episode
    });

    if (!result) {
      throw new Error("Episode creation failed.");
    }

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {
        episodeId: result._id
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
