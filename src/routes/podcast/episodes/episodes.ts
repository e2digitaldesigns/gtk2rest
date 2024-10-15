import express, { Request, Response } from "express";
import { verifyToken } from "../../_middleware";
import * as episodeFunctions from "./functions";

const router = express.Router();
router.use(verifyToken);

router.get("/as/:page/:sort/:sortby", async (req: Request, res: Response) => {
  const { page, sort, sortby } = req.params;
  const searchTerm = req.query?.st || "";
  const templateId = req.query?.tid || "";

  const data = await episodeFunctions.episodePagination(
    page,
    String(searchTerm),
    sort,
    sortby,
    String(templateId),
    res.locals.userId
  );
  res.status(data.resultStatus.responseCode).send(data);
});

router.post("/", async (req: Request, res: Response) => {
  const { currentState, templateId } = req.body;

  const data = await episodeFunctions.episodeCreate(
    currentState,
    req.body.name,
    templateId,
    res.locals.userId
  );
  res.status(data.resultStatus.responseCode).send(data);
});

router.delete("/:_id", async (req: Request, res: Response) => {
  const data = await episodeFunctions.episodeDelete(req.params._id, res.locals.userId);
  res.status(data.resultStatus.responseCode).send(data);
});

export const episodes = router;
