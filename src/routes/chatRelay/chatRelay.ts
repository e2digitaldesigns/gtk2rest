import express, { NextFunction, Request } from "express";

import { generateId } from "../../globalUtils";
import * as chatRelayFunctions from "./functions";
import * as clientState from "./clientState";
import { CustomResponse } from "./types";

const router = express.Router();

router.use((_, res: CustomResponse, next: NextFunction) => {
  const id = generateId();
  res.id = id;
  next();
});

router.get("/events/:userId", async (req: Request, res: CustomResponse) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  await clientState.addClient({ gtkUserId: req.params.userId, resId: String(res.id), res });
  await clientState.sendChatData(req.params.userId, res.id);

  req.on("close", () => {
    clientState.removeClient(String(res.id));
  });
});

// for testing purposes only
router.post("/log/:userId", async (req, res) => {
  const data = await chatRelayFunctions.logChatMessage(req.params.userId, req.body);
  res.status(data.resultStatus.responseCode).send(data);
});

router.patch("/remove", async (req, res) => {
  const { userId, messageId } = req.body;
  const data = await chatRelayFunctions.deleteChatMessage(userId, messageId);
  res.status(data.resultStatus.responseCode).send(data);
});

export const chatRelay = router;
