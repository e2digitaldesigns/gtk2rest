import { HostModel } from "../../../../../models";
import { mongoObjectId } from "../../../../_routeUtils/mongoObjectId";

export const getUpdatedHost = async (userId: string) => {
  const result = await HostModel.find({ userId: mongoObjectId(userId) }).select({
    __v: 0,
    userId: 0
  });

  return result || [];
};
