import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const mongoObjectId = (id?: string | mongoose.Types.ObjectId) => {
  if (id instanceof mongoose.Types.ObjectId) {
    return id;
  }

  return id ? new ObjectId(id) : new ObjectId();
};
