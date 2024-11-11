import { Client } from "../types";
import * as clientState from "../clientState";
import { ChatLogModel } from "../../../models";
import { mongoObjectId } from "../../../utils/routeUtils";

export async function sendChatData(userId: string, clientId?: string) {
	try {
		const connectedClients = clientId
			? clientState.getClientByResId(clientId)
			: clientState.getClientsByUserId(userId);

		const result = await ChatLogModel.find({
			isDeleted: { $ne: true },
			gtkUserId: mongoObjectId(userId)
		})
			.sort({ date: -1 })
			.limit(20);

		const data = JSON.stringify(result);

		connectedClients.forEach((client: Client) => {
			if (client) {
				client.res.write(`data: ${data}\n\n`);
			}
		});
	} catch (error) {
		console.error("Error sending chat data:", error);
	}
}
