import express, { Request, Response } from "express";
import { getSocketServer } from "../../startUpServices/socket";
import * as socketFunctions from "./functions";
import { verifyToken } from "../_middleware";
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

router.post("/overlay-controls", verifyToken, function (req: Request, res: Response) {
  const { action, data, socket, templateId } = req.body;
  const socketIO = getSocketServer();

  const nodeSendArray = {
    tid: templateId,
    uid: res.locals.userId,
    action,
    data
  };

  socketIO.emit(socket, nodeSendArray);
});

export const socket = router;
