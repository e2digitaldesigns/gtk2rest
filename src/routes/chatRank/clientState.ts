import { Client } from "./types";

let chatRankClients: Client[] = [];

export function addClient(client: Client) {
	chatRankClients.push(client);
}

export function removeClient(resId: string) {
	chatRankClients = chatRankClients.filter(client => client.resId !== resId);
}

export function getClientsByUserId(userId: string): Client[] {
	return chatRankClients.filter(client => client.gtkUserId === userId);
}

export function getClientByResId(resId: string): Client[] {
	return chatRankClients.filter(client => client.resId === resId);
}
