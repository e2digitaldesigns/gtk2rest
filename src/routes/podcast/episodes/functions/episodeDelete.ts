import { EpisodeModel, IEpisodeTopic, SponsorImages } from "../../../../models";
import { s3Functions } from "../../../../utils";
import { mongoObjectId } from "../../../_routeUtils";

export const episodeDelete = async (episodeId: string, userId: string) => {
  try {
    const episode = await EpisodeModel.findOne({
      _id: mongoObjectId(episodeId),
      userId: mongoObjectId(userId)
    }).select({
      logo: 1,
      sponsorImages: 1,
      topics: 1,
      video: 1
    });

    const imageArray: string[] = [];
    episode?.logo && imageArray.push(episode.logo);
    episode?.sponsorImages?.map((item: SponsorImages) => imageArray.push(item.url));
    episode?.topics?.map((item: IEpisodeTopic) => item?.img && imageArray.push(item.img));

    if (imageArray.length) {
      s3Functions.deleteMulti(imageArray, "images/user-images");
    }

    const videoArray: string[] = [];
    episode?.topics?.map((item: IEpisodeTopic) => {
      if (item?.video) {
        const video = item.video.split("/");
        videoArray.push(video[video.length - 1]);
      }
    });

    if (videoArray.length) {
      s3Functions.deleteMulti(videoArray, "videos/user-videos");
    }

    await EpisodeModel.deleteOne({
      _id: mongoObjectId(episodeId),
      userId: mongoObjectId(userId)
    });

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {}
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
