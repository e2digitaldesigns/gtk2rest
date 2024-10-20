import { PipelineStage } from "mongoose";
import { SocialNetworkModel } from "../../../../../models/socialNetworks.model";
import { mongoObjectId } from "../../../../../utils/routeUtils";

export const socialSearch = async (
  page: string,
  searchTerm: string,
  sort: string,
  sortBy: string,
  site: string,
  userId: string
) => {
  const documentsPerPage = 10;
  const skip = (Number(page) - 1) * documentsPerPage;

  const pipeline: PipelineStage[] = [
    {
      $match: {
        userId: mongoObjectId(userId)
      }
    },
    {
      $match: {
        username: {
          $regex: searchTerm,
          $options: "i"
        }
      }
    },
    {
      $project: {
        site: 1,
        username: 1
      }
    }
  ];

  if (site) {
    pipeline.push({
      $match: {
        site: { $eq: site }
      }
    });
  }

  try {
    const totalDocumentCount = await SocialNetworkModel.aggregate(pipeline).exec();
    const totalPageCount = Math.ceil(totalDocumentCount.length / documentsPerPage);

    pipeline.push(
      { $sort: { [sort]: sortBy === "asc" ? 1 : -1 } },
      { $skip: skip },
      { $limit: documentsPerPage }
    );

    const result = await SocialNetworkModel.aggregate(pipeline).exec();

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
        socials: result
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
