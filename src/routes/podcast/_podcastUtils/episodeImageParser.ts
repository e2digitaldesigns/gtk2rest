import { SponsorImages } from "../../../models/episodes.model";

export const episodeImageParser = (images: string | SponsorImages[]) => {
  if (typeof images === "string") {
    return process.env.S3_CLOUD_IMAGES + images;
  }

  if (Array.isArray(images)) {
    return images.map((image: SponsorImages) => {
      return {
        ...image,
        url: process.env.S3_CLOUD_IMAGES + image.url
      };
    });
  }
};
