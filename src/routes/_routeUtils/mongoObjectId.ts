import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const mongoObjectId = (id: string) => {
  return new ObjectId(id);
};
