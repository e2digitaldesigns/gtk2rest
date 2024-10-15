import { HostModel, IHost } from "../../../../models";
import { mongoObjectId } from "../../../_routeUtils/mongoObjectId";
import { getUpdatedHost } from "./getUpdatedHost";

export const deleteHost = async (userId: string, hostId: string) => {
  try {
    const action = await HostModel.deleteOne({
      _id: mongoObjectId(hostId),
      userId: mongoObjectId(userId)
    });

    if (!action) {
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
