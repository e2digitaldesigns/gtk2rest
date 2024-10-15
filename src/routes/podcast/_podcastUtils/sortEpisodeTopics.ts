import _sortBy from "lodash/sortBy";
import { IEpisodeTopic } from "../../../models/episodes.model";

export const sortEpisodeTopics = (topics: IEpisodeTopic[]): IEpisodeTopic[] => {
  let sortedTopics: IEpisodeTopic[] = [];

  topics = _sortBy(topics, "order");

  const topLevel = topics.filter(topic => topic.isChild === false);

  for (let i = 0; i < topLevel.length; i++) {
    sortedTopics.push(topLevel[i]);

    const child = topics.filter(child => child.parentId === String(topLevel[i]._id));

    for (let j = 0; j < child.length; j++) {
      sortedTopics.push(child[j]);
    }
  }

  for (let i = 0; i < sortedTopics.length; i++) {
    sortedTopics[i].order = i + 1;
  }

  return sortedTopics;
};
