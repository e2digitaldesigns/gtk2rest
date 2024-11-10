import express, { Request, Response } from "express";
import { verifyToken } from "../../../_middleware";
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

router.put("/:_id", async (req: Request, res: Response) => {
	const data = await socialNetworkFunctions.updateSocial(
		res.locals.userId,
		req.body._id,
		req.body.site,
		req.body.username
	);
	res.status(data.resultStatus.responseCode).send(data);
});

router.post("/", async (req: Request, res: Response) => {
	const data = await socialNetworkFunctions.createSocial(
		res.locals.userId,
		req.body.site,
		req.body.username
	);
	res.status(data.resultStatus.responseCode).send(data);
});

router.delete("/:_id", async (req: Request, res: Response) => {
	const data = await socialNetworkFunctions.deleteSocial(req.params._id, res.locals.userId);
	res.status(data.resultStatus.responseCode).send(data);
});

export const socialNetworks = router;
