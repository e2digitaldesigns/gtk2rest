import { EpisodeModel } from "../../models";
import { mongoObjectId } from "../routeUtils";
import { sortEpisodeTopicWithContent } from "./sortEpisodeTopicWithContent";

export const getUpdatedTopics = async (episodeId: string) => {
  const updatedEpisode = await EpisodeModel.findOne({
    _id: mongoObjectId(episodeId)
  }).lean();

  const topics = updatedEpisode?.topics ? sortEpisodeTopicWithContent(updatedEpisode.topics) : [];

  return topics;
};
