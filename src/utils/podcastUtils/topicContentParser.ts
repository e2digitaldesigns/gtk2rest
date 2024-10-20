import _cloneDeep from "lodash/cloneDeep";
import { IEpisodeTopic, TopicContent } from "../../models";

const cloudImageBucket = process.env.S3_CLOUD_IMAGES as string;
const cloudVideoBucket = process.env.S3_CLOUD_VIDEOS as string;

const contentFileParser = (content: TopicContent | undefined): string => {
  if (!content) {
    return "";
  }
  const bucket =
    content.type === "image"
      ? cloudImageBucket
      : content.type === "video"
      ? cloudVideoBucket
      : null;

  if (bucket && content.file) {
    return bucket + content.file;
  }

  return "";
};

export const topicContentParser = (topics: IEpisodeTopic[]) => {
  const newTopics = topics?.map(topic => {
    const newTopic = _cloneDeep(topic);

    return {
      ...newTopic,
      img: topic.img ? cloudImageBucket + topic.img : "",
      content: {
        type: newTopic?.content?.type || null,
        file: contentFileParser(newTopic?.content)
      }
    };
  });

  return newTopics;
};
