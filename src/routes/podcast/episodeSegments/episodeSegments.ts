import express, { Request, Response } from "express";
import multer from "multer";
import { verifyToken } from "../../_middleware";

import * as episodeSegmentFunctions from "./functions";
import { IEpisode } from "../../../models";

const storage = multer.memoryStorage();
const uploadSingle = multer({ storage: storage }).single("file");

const router = express.Router();
router.use(verifyToken);

// EPISODE INFO
router.get("/information/:episodeId", async (req: Request, res: Response) => {
  const data = await episodeSegmentFunctions.fetchEpisodeInformation(
    req.params.episodeId,
    res.locals.userId
  );
  res.status(data.resultStatus.responseCode).send(data);
});

router.put(
  "/information/:episodeId",
  async (req: Request<{ episodeId: string }, unknown, Partial<IEpisode>>, res: Response) => {
    const data = await episodeSegmentFunctions.updateEpisodeInformation(
      req.params.episodeId,
      res.locals.userId,
      req.body
    );
    res.status(data.resultStatus.responseCode).send(data);
  }
);

// EPISODE HOSTS
router.get("/hosts/:episodeId", async (req: Request, res: Response) => {
  const data = await episodeSegmentFunctions.fetchEpisodeHost(
    req.params.episodeId,
    res.locals.userId
  );
  res.status(data.resultStatus.responseCode).send(data);
});

router.post("/hosts/:episodeId", async (req: Request, res: Response) => {
  const data = await episodeSegmentFunctions.updateEpisodeHost(
    req.params.episodeId,
    res.locals.userId,
    req.body.episodeHosts
  );
  res.status(data.resultStatus.responseCode).send(data);
});

// EPISODE NEWS
router.get("/news/:episodeId", async (req: Request, res: Response) => {
  const data = await episodeSegmentFunctions.fetchEpisodeNews(
    req.params.episodeId,
    res.locals.userId
  );
  res.status(data.resultStatus.responseCode).send(data);
});

router.post("/news/:episodeId", async (req: Request, res: Response) => {
  const data = await episodeSegmentFunctions.createEpisodeNews(
    req.params.episodeId,
    res.locals.userId,
    req.body
  );
  res.status(data.resultStatus.responseCode).send(data);
});

router.put("/news/:episodeId/", async (req: Request, res: Response) => {
  const data = await episodeSegmentFunctions.updateEpisodeNews(
    req.params.episodeId,
    res.locals.userId,
    req.body
  );
  res.status(data.resultStatus.responseCode).send(data);
});

router.delete("/news/:episodeId/:tickerId", async (req: Request, res: Response) => {
  const data = await episodeSegmentFunctions.deleteEpisodeNews(
    req.params.episodeId,
    req.params.tickerId,
    res.locals.userId
  );
  res.status(data.resultStatus.responseCode).send(data);
});

router.patch("/news/:episodeId", async (req: Request, res: Response) => {
  const data = await episodeSegmentFunctions.reorderEpisodeNews(
    req.params.episodeId,
    res.locals.userId,
    req.body.news
  );
  res.status(data.resultStatus.responseCode).send(data);
});

// EPISODE SOCIALS
router.get("/socials/:episodeId", async (req: Request, res: Response) => {
  const data = await episodeSegmentFunctions.fetchEpisodeSocials(
    req.params.episodeId,
    res.locals.userId
  );
  res.status(data.resultStatus.responseCode).send(data);
});

router.put("/socials/:episodeId", async (req: Request, res: Response) => {
  const data = await episodeSegmentFunctions.updateEpisodeSocials(
    req.params.episodeId,
    res.locals.userId,
    req.body.episodeSocials
  );
  res.status(data.resultStatus.responseCode).send(data);
});

// EPISODE IMAGES
router.get("/imaging/:episodeId", async (req: Request, res: Response) => {
  const data = await episodeSegmentFunctions.fetchEpisodeImages(
    req.params.episodeId,
    res.locals.userId
  );
  res.status(data.resultStatus.responseCode).send(data);
});

router.post("/imaging/:episodeId", uploadSingle, async (req: Request, res: Response) => {
  const data = await episodeSegmentFunctions.uploadEpisodeImages(
    req.params.episodeId,
    res.locals.userId,
    req.file as Express.Multer.File,
    req.body.imageType
  );
  res.status(data.resultStatus.responseCode).send(data);
});

router.put("/imaging/:episodeId", async (req: Request, res: Response) => {
  const data = await episodeSegmentFunctions.deleteEpisodeImage(
    req.params.episodeId,
    res.locals.userId,
    req.body.imageId,
    req.body.imageType
  );
  res.status(data.resultStatus.responseCode).send(data);
});

export const episodeSegments = router;
