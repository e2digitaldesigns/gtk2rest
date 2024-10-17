import { UserCommandsModel } from "../../../../../models";
import { mongoObjectId } from "../../../../_routeUtils";

export const fetchCommands = async (userId: string, type: string) => {
  try {
    let result = await UserCommandsModel.find({
      type
    });

    const commands = [];

    for (const command of result) {
      commands.push({
        _id: command._id,
        command: command.command,
        type: command.type,
        subType: command.subType,
        status: command.users.includes(mongoObjectId(userId)),
        usage: command.usage,
        description: command.description
      });
    }

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: { commands }
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
