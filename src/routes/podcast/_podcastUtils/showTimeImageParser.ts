import { SponsorImages } from "../../../models";

export const showTimeImageParser = (images: string | SponsorImages[]): string | String[] => {
  const baseUrl = process.env.S3_CLOUD_IMAGES as string;

  if (typeof images === "string") {
    return `${baseUrl}${images}`;
  }

  if (Array.isArray(images)) {
    return images.map((image: SponsorImages) => `${baseUrl}${image.url}`);
  }

  throw new Error("Invalid input type for images");
};
