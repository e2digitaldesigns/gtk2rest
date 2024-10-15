import { EpisodeModel, SponsorImages } from "../../../../../models/episodes.model";
import {
  generateFileName,
  getTemplateImageSize,
  imageSizeParser,
  s3Functions
} from "../../../../../utils";
import { mongoObjectId } from "../../../../_routeUtils";
import { episodeImageParser } from "../../../_podcastUtils";

type UploadFunctions = (episodeId: string, fileName: string) => Promise<void>;

const updateSponsorImage: UploadFunctions = async (episodeId: string, fileName: string) => {
  await EpisodeModel.findOneAndUpdate(
    { _id: mongoObjectId(episodeId) },
    { $push: { sponsorImages: { url: fileName } } }
  );
};

const updateLogoImage: UploadFunctions = async (episodeId: string, fileName: string) => {
  const episode = await EpisodeModel.findOne({
    _id: mongoObjectId(episodeId)
  }).select({ logo: 1 });

  if (episode?.logo) {
    await s3Functions.delete(episode.logo);
  }

  await EpisodeModel.findOneAndUpdate(
    { _id: mongoObjectId(episodeId) },
    { $set: { logo: fileName } }
  );
};

const uploadFunctionMap: Record<string, UploadFunctions> = {
  logo: updateLogoImage,
  sponsors: updateSponsorImage
};

export const uploadEpisodeImages = async (
  episodeId: string,
  userId: string,
  file: Express.Multer.File,
  type: string
) => {
  try {
    const { fileName } = generateFileName(file);
    const { width, height } = await getTemplateImageSize(episodeId, userId, type);
    const data = await imageSizeParser(file, width, height);
    const s3Push = await s3Functions.push(data, `images/user-images/${fileName}`);
    if (!s3Push) throw new Error("S3 Push failed");

    let images: SponsorImages[] | string | null = null;

    await uploadFunctionMap[type](episodeId, fileName);

    const newImages = await EpisodeModel.findOne({
      _id: mongoObjectId(episodeId),
      userId: mongoObjectId(userId)
    }).select({ logo: 1, sponsorImages: 1 });

    images =
      type === "logo"
        ? (episodeImageParser(newImages?.logo as string) as string)
        : (episodeImageParser(
            newImages?.toObject().sponsorImages as SponsorImages[]
          ) as SponsorImages[]);

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {
        imageType: type,
        images
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
