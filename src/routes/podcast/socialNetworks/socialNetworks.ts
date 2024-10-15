import express, { Request, Response } from "express";
import { verifyToken } from "../../_middleware";
import * as socialNetworkFunctions from "./functions";

const router = express.Router();
router.use(verifyToken);

router.get("/:page/:sort/:sortby", async (req: Request, res: Response) => {
  const { page, sort, sortby } = req.params;
  const searchTerm = req.query?.st || "";
  const site = req.query?.site || "";

  const data = await socialNetworkFunctions.socialSearch(
    page,
    String(searchTerm),
    sort,
    sortby,
    String(site),
    res.locals.userId
  );
  res.status(data.resultStatus.responseCode).send(data);
});

export const socialNetworks = router;
