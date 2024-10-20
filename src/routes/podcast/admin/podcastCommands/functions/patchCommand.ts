import { UserCommandsModel } from "../../../../../models";
import { mongoObjectId } from "../../../../../utils/routeUtils";

export const patchCommands = async (userId: string, _id: string, status: boolean) => {
  const action = status ? "$addToSet" : "$pull";

  try {
    const update = await UserCommandsModel.updateOne(
      {
        _id: mongoObjectId(_id)
      },
      {
        [action]: { users: mongoObjectId(userId) }
      }
    );

    if (!update) {
      throw new Error("Command not found");
    }

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: { setting: { _id, status } }
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
