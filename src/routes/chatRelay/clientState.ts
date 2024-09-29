import { ChatLogModel } from "../../models/chatLog.model";
import { Client, CustomResponse } from "./types";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

let clients: Client[] = [];

export function addClient(client: Client) {
  clients.push(client);
}

export function removeClient(resId: string) {
  clients = clients.filter(client => client.resId !== resId);
}

export function getClientsByUserId(userId: string): Client[] {
  return clients.filter(client => client.gtkUserId === userId);
}

export function getClientByResId(resId: string): Client[] {
  return clients.filter(client => client.resId === resId);
}

export async function sendChatData(userId: string, clientId?: string) {
  try {
    const connectedClients = clientId ? getClientByResId(clientId) : getClientsByUserId(userId);

    const result = await ChatLogModel.find({
      isDeleted: { $ne: true },
      gtkUserId: new ObjectId(userId)
    })
      .sort({ date: -1 })
      .limit(20);

    if (result.length) {
      connectedClients.forEach((client: Client) => {
        if (client) {
          client.res.write(`data: ${JSON.stringify(result)}\n\n`);
        }
      });
    }
  } catch (error) {}
}
