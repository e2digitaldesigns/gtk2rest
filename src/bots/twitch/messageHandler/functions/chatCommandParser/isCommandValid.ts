import { UserCommandsModel } from "../../../../../models";
import { mongoObjectId } from "../../../../../routes/_routeUtils";

export const validatedCommand = async (gtkUserId: string, command: string): Promise<boolean> => {
  const exceptions = ["!gtk", "!reply", "!cb"];
  if (exceptions.includes(command)) return true;

  const data = await UserCommandsModel.findOne({
    command: command
  }).select("users");

  if (!data) return false;

  return data.users.includes(mongoObjectId(gtkUserId));
};
