import express, { Request, Response } from "express";
import * as controlFunctions from "./functions";
import { verifyToken } from "../../_middleware";

const router = express.Router();

router.get("/", verifyToken, async (req: Request, res: Response) => {
  const data = await controlFunctions.getTemplates();
  res.status(data.resultStatus.responseCode).send(data);
});

export const templates = router;
