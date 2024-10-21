import express, { Request, Response } from "express";
import { verifyToken } from "../../../_middleware";
import * as chatDisplayFunctions from "./functions";

const router = express.Router();

router.post("/send-to-overlay/", verifyToken, async (req: Request, res: Response) => {
  const data = await chatDisplayFunctions.sendChatMessageToOverlay(
    res.locals.userId,
    req.body.messageId,
    req.body.showTime,
    req.body.transition
  );

  res.status(data.resultStatus.responseCode).send(data);
});

router.post("/clear-chat-message/", verifyToken, async (req: Request, res: Response) => {
  const data = await chatDisplayFunctions.clearMessageFromOverlay(res.locals.userId);

  res.status(data.resultStatus.responseCode).send(data);
});

export const chatDisplay = router;
