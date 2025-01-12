import express, { Request, Response } from "express";
import { getSocketServer } from "../../startUpServices/socket";
import * as socketFunctions from "./functions";
import { verifyToken } from "../_middleware";
import { createHostVote, getTemplateFromUserId } from "utils";

const router = express.Router();

router.get("/", (_, res: Response) => {
	res.send("Socket Manual");
});

router.get("/manual/:type", function (req: Request, res: Response) {
	const { action, nodeSendArray } = socketFunctions.socketParseParams(req.url, req.params.type);
	const socketIO = getSocketServer();

	res.send(nodeSendArray);
	socketIO.emit(action, nodeSendArray);
});

router.post("/manual/:type", function (req: Request, res: Response) {
	const { action, nodeSendArray } = socketFunctions.socketParseParams(
		req.url,
		req.params.type,
		req.body
	);

	const socketIO = getSocketServer();

	res.json({ action, nodeSendArray });
	socketIO.emit(action, nodeSendArray);
});

router.get("/client/overlay-controls", async function (req: Request, res: Response) {
	try {
		const action = (req.query.action as string) || "";
		const data = (req.query.data as object) || {};
		const socket = (req.query.socket as string) || "";
		const userId = (req.query.uid as string) || "";

		const nodeSendArray = {
			tid: await getTemplateFromUserId(userId),
			uid: userId,
			action,
			data
		};

		res.json({ action, nodeSendArray });

		const socketIO = getSocketServer();
		socketIO.emit(socket, nodeSendArray);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
});

router.post("/overlay-controls", verifyToken, async function (req: Request, res: Response) {
	const { action, data, socket } = req.body;
	const socketIO = getSocketServer();

	const nodeSendArray = {
		tid: await getTemplateFromUserId(res.locals.userId),
		uid: res.locals.userId,
		action,
		data
	};

	res.json({ action, nodeSendArray });
	socketIO.emit(socket, nodeSendArray);
});

router.post(
	"/overlay-controls/host-vote",
	verifyToken,
	async function (req: Request, res: Response) {
		const { action, socket } = req.body;

		console.log({ action, socket });

		const vote = await createHostVote(res.locals.userId, action, socket);
		if (!vote) {
			res.status(400).json({ error: "Invalid action" });
			return;
		}

		res.json({ success: vote });
	}
);

export const socket = router;
