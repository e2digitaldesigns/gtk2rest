import { Client } from "../types";
import * as clientState from "../clientState";
import { ChatVotingModel } from "../../../models";
import { mongoObjectId } from "../../../utils/routeUtils";

export async function sendChatVotingData(userId: string, clientId?: string) {
  try {
    const dataLimit = 50;
    const connectedClients = clientId
      ? clientState.getClientByResId(clientId)
      : clientState.getClientsByUserId(userId);

    const result = await ChatVotingModel.aggregate([
      {
        $match: {
          gtkUserId: mongoObjectId(userId),
          isDeleted: { $ne: true }
        }
      },
      {
        $group: {
          _id: "$chatterUsername",
          username: { $last: "$chatterUsername" },
          image: { $last: "$chatterImage" },
          votes: { $sum: "$votes" }
        }
      },
      { $sort: { votes: -1, date: -1 } },
      { $limit: dataLimit }
    ]).exec();

    if (result?.length > 0) {
      result.forEach((element, index) => {
        element.rank = index + 1;
      });
    }

    connectedClients.forEach((client: Client) => {
      if (client) {
        client.res.write(`data: ${JSON.stringify(result)}\n\n`);
      }
    });
  } catch (error) {}
}
