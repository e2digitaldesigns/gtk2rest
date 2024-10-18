import { Client } from "./types";

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
