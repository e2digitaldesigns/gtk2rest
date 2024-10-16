import express, { Request, Response } from "express";
import { verifyToken } from "../../_middleware";
import * as commandFunctions from "./functions";

const router = express.Router();
router.use(verifyToken);

router.get("/", async (req: Request, res: Response) => {
  const data = await commandFunctions.fetchCommands(res.locals.userId, String(req.query.type));
  res.status(data.resultStatus.responseCode).send(data);
});

router.patch("/", async (req: Request, res: Response) => {
  const data = await commandFunctions.patchCommands(
    res.locals.userId,
    String(req.body._id),
    req.body.status
  );
  res.status(data.resultStatus.responseCode).send(data);
});

export const podcastCommands = router;
