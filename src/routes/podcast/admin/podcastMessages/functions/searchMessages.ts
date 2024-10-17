import { CannedMessageModel } from "../../../../../models";
import { mongoObjectId } from "../../../../_routeUtils";

export const searchMessage = async (
  userId: string,
  searchTerm: string,
  page: string | number,
  sort: string,
  sortby: string
) => {
  try {
    const documentsPerPage = 10;
    const skip = (Number(page) - 1) * documentsPerPage;

    const totalDocuments = await CannedMessageModel.countDocuments({
      message: { $regex: searchTerm, $options: "i" },
      userId: mongoObjectId(userId)
    });

    const result = await CannedMessageModel.find({
      message: { $regex: searchTerm, $options: "i" },
      userId: mongoObjectId(userId)
    })
      .sort({ [sortby]: sort === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(documentsPerPage);

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {
        messages: result,
        totalPages: totalDocuments / documentsPerPage
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
