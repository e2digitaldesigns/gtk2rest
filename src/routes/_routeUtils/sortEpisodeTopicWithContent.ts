import { IEpisodeTopic } from "../../models/episodes.model";
import { sortEpisodeTopics } from "./sortEpisodeTopics";
import { topicContentParser } from "./topicContentParser";

export const sortEpisodeTopicWithContent = (topics: IEpisodeTopic[]) => {
  return sortEpisodeTopics(topicContentParser(topics));
};
