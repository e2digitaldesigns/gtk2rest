import mongoose from "mongoose";
import { UserCommandsModel } from "../../../../../models/commands.model";
const ObjectId = mongoose.Types.ObjectId;

export const validatedCommand = async (gtkUserId: string, command: string): Promise<boolean> => {
  const exceptions = ["!gtk", "!reply", "!cb"];
  if (exceptions.includes(command)) return true;

  const data = await UserCommandsModel.findOne({
    command: command
  }).select("users");

  if (!data) return false;

  return data.users.includes(new ObjectId(gtkUserId));
};
