import { SponsorImages } from "../../models";

export const sponsorImageParser = (sponsorImages: SponsorImages[]) => {
  const newSponsorImages: SponsorImages[] = [];
  sponsorImages?.map((item: SponsorImages) => {
    newSponsorImages.push({
      _id: item._id,
      url: (process.env.S3_CLOUD_IMAGES as string) + item.url
    });
  });

  return newSponsorImages;
};
