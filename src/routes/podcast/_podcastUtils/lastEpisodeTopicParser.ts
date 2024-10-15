import { IEpisodeTopic } from "../../../models";
import { s3Functions } from "../../../utils";

export const lastEpisodeTopicParser = async (useCurrent: boolean, topics?: IEpisodeTopic[]) => {
  if (useCurrent && topics) {
    const newTopics = await Promise.all(
      topics.map(async (item: IEpisodeTopic) => {
        const newItem = {
          ...item,
          img: item?.img ? await s3Functions.copy(item.img) : ""
        };

        return newItem;
      })
    );

    await new Promise(resolve => setTimeout(resolve, 1000)); // This can be removed if not needed
    return newTopics;
  }

  return [
    {
      order: 1,
      name: "New Topic 1",
      desc: "Description for topic 1",
      timer: 0,
      isParent: false,
      isChild: false,
      parentId: " ",
      img: "",
      articles: ""
    }
  ];
};
