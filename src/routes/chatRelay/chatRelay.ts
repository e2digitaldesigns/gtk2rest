import express, { NextFunction, Request } from "express";

import * as chatRelayFunctions from "./functions";
import * as clientState from "./clientState";
import { CustomResponse } from "./types";
import { verifyToken } from "../_middleware";
import { generateId } from "../../utils";

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
  await chatRelayFunctions.sendChatData(req.params.userId, res.id);

  req.on("close", () => {
    clientState.removeClient(String(res.id));
  });
});

router.post("/log/:userId", async (req, res) => {
  const data = await chatRelayFunctions.logChatMessage(req.params.userId, req.body);
  res.status(data.resultStatus.responseCode).send(data);
});

router.patch("/remove", verifyToken, async (req, res) => {
  const data = await chatRelayFunctions.deleteChatMessage(res.locals.userId, req.body.messageId);
  res.status(data.resultStatus.responseCode).send(data);
});

router.patch("/reset", verifyToken, async (_, res) => {
  const data = await chatRelayFunctions.resetChatMessages(res.locals.userId);
  res.status(data.resultStatus.responseCode).send(data);
});

export const chatRelay = router;
