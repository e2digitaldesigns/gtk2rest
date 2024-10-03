import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
import { Client } from "../types";
import * as clientState from "../clientState";
import { ChatLogModel } from "../../../models/chatLog.model";

export async function sendChatRankData(userId: string, clientId?: string) {
  try {
    const connectedClients = clientId
      ? clientState.getClientByResId(clientId)
      : clientState.getClientsByUserId(userId);

    const result = await ChatLogModel.aggregate([
      {
        $match: {
          gtkUserId: new ObjectId(userId),
          isDeleted: { $ne: true },
          isRankReset: { $ne: true }
        }
      },
      {
        $group: {
          _id: "$username",
          username: { $last: "$username" },
          image: { $last: "$image" },
          messageCount: { $sum: 1 }
        }
      },
      { $sort: { messageCount: -1, date: 1 } },
      { $limit: 50 }
    ]).exec();

    connectedClients.forEach((client: Client) => {
      if (client) {
        client.res.write(`data: ${JSON.stringify(result)}\n\n`);
      }
    });
  } catch (error) {}
}
