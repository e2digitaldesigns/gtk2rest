import { HostModel, IHost } from "../../../../../models";
import { mongoObjectId } from "../../../../../utils/routeUtils/mongoObjectId";
import { getUpdatedHost } from "./getUpdatedHost";

export const updateHost = async (userId: string, hostId: string, host: IHost) => {
  try {
    const update = await HostModel.updateOne(
      {
        _id: mongoObjectId(hostId),
        userId: mongoObjectId(userId)
      },
      { $set: { ...host } }
    );

    if (!update) {
      throw new Error("Host not found");
    }

    const hosts = await getUpdatedHost(userId);

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {
        hosts
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
