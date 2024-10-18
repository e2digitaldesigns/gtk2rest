import express, { Request, Response } from "express";
import { verifyToken } from "../_middleware";
import * as twitchFunctions from "./functions";

const router = express.Router();

router.get("/is-connected", verifyToken, async (_, res: Response) => {
  const data = await twitchFunctions.isConnected(res.locals.userId);
  res.status(data.resultStatus.responseCode).send(data);
});

router.get("/disconnect-from-chat", verifyToken, async (_, res: Response) => {
  const data = await twitchFunctions.removeChannelFromClient(res.locals.userId);
  res.status(data.resultStatus.responseCode).send(data);
});

router.post("/add-to-chat", verifyToken, async (req: Request, res: Response) => {
  const data = await twitchFunctions.addChannelToClient(res.locals.userId, req.body);
  res.status(data.resultStatus.responseCode).send(data);
});

router.get("/twitch-username/", verifyToken, async (req: Request, res: Response) => {
  const data = await twitchFunctions.getTwitchUsername(res.locals.userId);
  res.status(data.resultStatus.responseCode).send(data);
});

router.post("/send-message/", verifyToken, async (req: Request, res: Response) => {
  const data = await twitchFunctions.sendMessage(res.locals.userId, req.body.message);
  res.status(data.resultStatus.responseCode).send(data);
});

export const twitchChat = router;
