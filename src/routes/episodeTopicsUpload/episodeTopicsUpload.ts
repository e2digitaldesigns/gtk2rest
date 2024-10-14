import express, { Request, Response } from "express";
import { verifyToken } from "../_middleware";
import * as epTopicFunctions from "./functions";
import multer from "multer";

const router = express.Router();
router.use(verifyToken);

const storage = multer.memoryStorage();
const uploadSingle = multer({ storage: storage }).single("file");

router.post("/topic/thumbnail", uploadSingle, async (req: Request, res: Response) => {
  const data = await epTopicFunctions.episodeTopicThumbnail(
    req.body.episodeId,
    req.file as Express.Multer.File,
    req.body.imageType,
    req.body.topicId,
    res.locals.userId
  );

  res.status(data.resultStatus.responseCode).send(data);
});

router.post("/topic-content-transparent", uploadSingle, async (req: Request, res: Response) => {
  const data = await epTopicFunctions.episodeTopicTransparentContent(
    req.body.episodeId,
    req.body.topicId,
    res.locals.userId
  );

  res.status(data.resultStatus.responseCode).send(data);
});

router.post("/topic-content", uploadSingle, async (req: Request, res: Response) => {
  const data = await epTopicFunctions.episodeTopicContent(
    req.body.episodeId,
    req.body.topicId,
    req.file as Express.Multer.File,
    res.locals.userId
  );

  res.status(data.resultStatus.responseCode).send(data);
});

router.post("/topic-content-youtube", async (req: Request, res: Response) => {
  const data = await epTopicFunctions.episodeTopicYoutube(
    req.body.episodeId,
    req.body.topicId,
    req.body.videoUrl
  );

  res.status(data.resultStatus.responseCode).send(data);
});

router.delete("/:episodeId/:imageType/:topicId", async (req: Request, res: Response) => {
  const data = await epTopicFunctions.episodeTopicContentDelete(
    req.params.episodeId,
    req.params.topicId,
    req.params.imageType
  );

  res.status(data.resultStatus.responseCode).send(data);
});

export const episodeTopicsUpload = router;
