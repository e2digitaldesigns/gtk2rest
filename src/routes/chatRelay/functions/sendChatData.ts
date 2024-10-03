import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
import { Client } from "../types";
import * as clientState from "../clientState";
import { ChatLogModel } from "../../../models/chatLog.model";

export async function sendChatData(userId: string, clientId?: string) {
  try {
    const connectedClients = clientId
      ? clientState.getClientByResId(clientId)
      : clientState.getClientsByUserId(userId);

    const result = await ChatLogModel.find({
      isDeleted: { $ne: true },
      gtkUserId: new ObjectId(userId)
    })
      .sort({ date: -1 })
      .limit(20);

    connectedClients.forEach((client: Client) => {
      if (client) {
        client.res.write(`data: ${JSON.stringify(result)}\n\n`);
      }
    });
  } catch (error) {}
}
