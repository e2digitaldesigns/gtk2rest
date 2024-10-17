import express, { Request, Response } from "express";
import * as episodeFunctions from "./functions";
import { verifyToken } from "../../../_middleware";

const router = express.Router();

router.get("/template/:userId/:templateId", async (req: Request, res: Response) => {
  const data = await episodeFunctions.getEpisode(
    req.params.userId,
    "template",
    req.params.templateId
  );

  res.status(data.resultStatus.responseCode).send(data);
});

router.get("/episode/:userId/:episodeId", async (req: Request, res: Response) => {
  const data = await episodeFunctions.getEpisode(
    req.params.userId,
    "episode",
    req.params.episodeId
  );
  res.status(data.resultStatus.responseCode).send(data);
});

router.get("/show-runner/:episodeId", async (req: Request, res: Response) => {
  const data = await episodeFunctions.getShowRunner(req.params.episodeId);

  res.status(data.resultStatus.responseCode).send(data);
});

router.get("/controlCenter/:templateId", verifyToken, async (req: Request, res: Response) => {
  const data = await episodeFunctions.getControlCenter(res.locals.userId, req.params.templateId);

  res.status(data.resultStatus.responseCode).send(data);
});

export const episodeData = router;
