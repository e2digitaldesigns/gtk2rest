import express, { Request, Response } from "express";
import { verifyToken } from "../_middleware";
import * as epTopicFunctions from "./functions";

const router = express.Router();
router.use(verifyToken);

router.get("/:episodeId", async (req: Request, res: Response) => {
  const data = await epTopicFunctions.getEpisodeTopics(req.params.episodeId, res.locals.userId);
  res.status(data.resultStatus.responseCode).send(data);
});

router.post("/:episodeId", async (req: Request, res: Response) => {
  const data = await epTopicFunctions.newEpisodeTopic(req.params.episodeId, res.locals.userId);
  res.status(data.resultStatus.responseCode).send(data);
});

router.put("/:episodeId", async (req: Request, res: Response) => {
  const data = await epTopicFunctions.updateEpisodeTopics(
    req.body,
    req.params.episodeId,
    res.locals.userId
  );
  res.status(data.resultStatus.responseCode).send(data);
});

router.put("/reorder/:episodeId", async (req: Request, res: Response) => {
  const data = await epTopicFunctions.reorderEpisodeTopics(
    req.params.episodeId,
    req.body.topics,
    res.locals.userId
  );
  res.status(data.resultStatus.responseCode).send(data);
});

router.post("/copy/:episodeId", async (req: Request, res: Response) => {
  const data = await epTopicFunctions.copyEpisodeTopics(
    req.params.episodeId,
    req.body.topicId,
    res.locals.userId
  );
  res.status(data.resultStatus.responseCode).send(data);
});

router.delete("/:episodeId/:topicId", async (req: Request, res: Response) => {
  const data = await epTopicFunctions.deleteEpisodeTopic(
    req.params.episodeId,
    req.params.topicId,
    res.locals.userId
  );
  res.status(data.resultStatus.responseCode).send(data);
});

export const episodeTopics = router;
