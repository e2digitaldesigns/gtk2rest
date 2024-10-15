import { EpisodeModel, IEpisode, ITemplate } from "../../../../models";
import { mongoObjectId } from "../../../_routeUtils";

interface IEpisodeResult extends IEpisode {
  template: ITemplate[];
}

type EpisodeList = {
  _id: string;
  name: string;
  airDate: string;
  current: boolean;
  templateName: string;
};

export const episodePagination = async (
  page: string,
  searchTerm: string,
  sort: string,
  sortBy: string,
  templateId: string,
  userId: string
) => {
  const documentsPerPage = 10;
  const skip = (Number(page) - 1) * documentsPerPage;
  const searchTemplateId = templateId ? mongoObjectId(templateId) : "";
  const episodeArray: EpisodeList[] = [];

  let pipeline: any[] = [
    {
      $match: {
        userId: mongoObjectId(userId)
      }
    },
    {
      $lookup: {
        from: "templates",
        localField: "templateId",
        foreignField: "_id",
        as: "template"
      }
    },
    {
      $project: {
        name: 1,
        airDate: 1,
        current: 1,
        template: 1,
        templateId: 1
      }
    },
    {
      $match: {
        name: {
          $regex: searchTerm,
          $options: "i"
        }
      }
    }
  ];

  if (searchTemplateId) {
    pipeline.push({
      $match: {
        templateId: { $eq: searchTemplateId }
      }
    });
  }

  try {
    const totalDocumentCount = await EpisodeModel.aggregate(pipeline).exec();
    const totalPageCount = Math.ceil(totalDocumentCount.length / documentsPerPage);

    pipeline.push(
      { $sort: { [sort]: sortBy === "asc" ? 1 : -1 } },
      { $skip: skip },
      { $limit: documentsPerPage }
    );

    const result = await EpisodeModel.aggregate(pipeline).exec();

    result.map((item: IEpisodeResult) => {
      episodeArray.push({
        _id: String(item._id),
        name: item.name,
        airDate: item.airDate,
        current: item.current,
        templateName: item.template?.[0]?.name || " "
      });
    });

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {
        totalDocuments: totalDocumentCount.length,
        currentPage: page,
        totalPages: totalPageCount,
        episodes: episodeArray
      }
    };
  } catch (error) {
    return {
      resultStatus: {
        success: false,
        errors: error,
        responseCode: 400,
        resultMessage: "Your request failed."
      }
    };
  }
};
