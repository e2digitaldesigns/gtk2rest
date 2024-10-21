import { model, Schema, Types } from "mongoose";

export interface UserTemplate {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  templateId: Types.ObjectId;
}

const UserTemplateSchema = new Schema<UserTemplate>({
  userId: { type: Schema.Types.ObjectId, required: true },
  templateId: { type: Schema.Types.ObjectId, required: true }
});

export const UserTemplateModel = model("userTemplates", UserTemplateSchema);
