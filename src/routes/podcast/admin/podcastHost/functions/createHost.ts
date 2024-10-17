import { HostModel } from "../../../../../models";
import { getUpdatedHost } from "./getUpdatedHost";

export const createHost = async (userId: string, hostName: string) => {
  try {
    const action = await HostModel.create({
      userId: userId,
      name: hostName,
      socials: []
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
        host: {
          id: action._id,
          name: action.name,
          socials: action.socials
        },
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
