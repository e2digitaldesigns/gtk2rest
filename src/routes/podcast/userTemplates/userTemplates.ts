import express, { Request, Response } from "express";
import * as templateFunctions from "./functions";
import { verifyToken } from "../../_middleware";

const router = express.Router();

router.patch("/", verifyToken, async (req: Request, res: Response) => {
  const data = await templateFunctions.changeUserTemplate(res.locals.userId, req.body.templateId);
  res.status(data.resultStatus.responseCode).send(data);
});

export const userTemplates = router;
