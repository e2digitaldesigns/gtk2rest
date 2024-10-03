import express, { NextFunction, Request } from "express";

import { generateId } from "../../globalUtils";
import * as chatRankFunctions from "./functions";
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
  await chatRankFunctions.sendChatRankData(req.params.userId, res.id);

  req.on("close", () => {
    clientState.removeClient(String(res.id));
  });
});

router.patch("/reset/:userId/", async (req: Request, res: CustomResponse) => {
  const data = await chatRankFunctions.resetChatRanks(req.params.userId);
  res.status(data.resultStatus.responseCode).send(data);
});

export const chatRank = router;
