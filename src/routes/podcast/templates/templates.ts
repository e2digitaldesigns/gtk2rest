import express, { Request, Response } from "express";
import * as templateFunctions from "./functions";
import { verifyToken } from "../../_middleware";

const router = express.Router();

router.get("/", verifyToken, async (_, res: Response) => {
  const data = await templateFunctions.getTemplates();
  res.status(data.resultStatus.responseCode).send(data);
});

export const templates = router;
