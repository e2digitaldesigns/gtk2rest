import express, { Request, Response } from "express";
import { socketParseParams } from "./socketParamParsers";
import { getSocketServer } from "../../startUpServices/socket";
const router = express.Router();

router.get("/", (_, res: Response) => {
  res.send("Socket Manual");
});

router.get("/manual/:type", function (req: Request, res: Response) {
  const { action, nodeSendArray } = socketParseParams(req.url, req.params.type);
  const socketIO = getSocketServer();

  res.send(nodeSendArray);
  socketIO.emit(action, nodeSendArray);
});

router.post("/manual/:type", function (req: Request, res: Response) {
  const { action, nodeSendArray } = socketParseParams(req.url, req.params.type, req.body);

  const socketIO = getSocketServer();

  res.json({ action, nodeSendArray });
  socketIO.emit(action, nodeSendArray);
});

export const socket = router;
