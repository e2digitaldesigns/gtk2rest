import { Client } from "./types";

let chatVotingClients: Client[] = [];

export function addClient(client: Client) {
	chatVotingClients.push(client);
}

export function removeClient(resId: string) {
	chatVotingClients = chatVotingClients.filter(client => client.resId !== resId);
}

export function getClientsByUserId(userId: string): Client[] {
	return chatVotingClients.filter(client => client.gtkUserId === userId);
}

export function getClientByResId(resId: string): Client[] {
	return chatVotingClients.filter(client => client.resId === resId);
}
