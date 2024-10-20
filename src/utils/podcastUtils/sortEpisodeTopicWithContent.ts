import { IEpisodeTopic } from "../../models";
import { sortEpisodeTopics } from "./sortEpisodeTopics";
import { topicContentParser } from "./topicContentParser";

export const sortEpisodeTopicWithContent = (topics: IEpisodeTopic[]) => {
  return sortEpisodeTopics(topicContentParser(topics));
};
