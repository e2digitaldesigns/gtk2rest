import express, { Request, Response } from "express";
import * as templateFunctions from "./functions";
import { verifyToken } from "../../_middleware";

const router = express.Router();

router.patch("/", verifyToken, async (req: Request, res: Response) => {
	const data = await templateFunctions.changeUserTemplate(res.locals.userId, req.body.templateId);
	res.status(data.resultStatus.responseCode).send(data);
});

router.get("/client", async (req: Request, res: Response) => {
	const userId = (req.query.uid as string) || "";
	const templateId = (req.query.tid as string) || "";

	console.log(userId, templateId);

	const data = await templateFunctions.changeUserTemplate(userId, templateId);
	res.status(data.resultStatus.responseCode).send(data);
});

export const userTemplates = router;
