import { Client } from "./types";

let chatRelayClients: Client[] = [];

export function addClient(client: Client) {
	chatRelayClients.push(client);
}

export function removeClient(resId: string) {
	chatRelayClients = chatRelayClients.filter(client => client.resId !== resId);
}

export function getClientsByUserId(userId: string): Client[] {
	return chatRelayClients.filter(client => client.gtkUserId === userId);
}

export function getClientByResId(resId: string): Client[] {
	return chatRelayClients.filter(client => client.resId === resId);
}
