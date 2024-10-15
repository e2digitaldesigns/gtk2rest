import express, { Request, Response } from "express";
import { verifyToken } from "../../_middleware";
import * as hostFunctions from "./functions";

const router = express.Router();
router.use(verifyToken);

router.get("/", async (_, res: Response) => {
  const data = await hostFunctions.fetchHost(res.locals.userId);
  res.status(data.resultStatus.responseCode).send(data);
});

router.post("/", async (req: Request, res: Response) => {
  const data = await hostFunctions.createHost(res.locals.userId, req.body.name);
  res.status(data.resultStatus.responseCode).send(data);
});

router.put("/:_id", async (req: Request, res: Response) => {
  const data = await hostFunctions.updateHost(res.locals.userId, req.params._id, req.body);
  res.status(data.resultStatus.responseCode).send(data);
});

router.delete("/:_id", async (req: Request, res: Response) => {
  const data = await hostFunctions.deleteHost(res.locals.userId, req.params._id);
  res.status(data.resultStatus.responseCode).send(data);
});

export const podcastHosts = router;
