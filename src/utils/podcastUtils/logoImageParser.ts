export const logoImageParser = (image: string | undefined) => {
  return image ? process.env.S3_CLOUD_IMAGES + image : "";
};
