import express, { Request, Response } from "express";
const router = express.Router();

import * as authFunctions from "./functions";

router.post("/firebase", async (req: Request, res: Response) => {
  const { email, name, picture } = req.body;

  const data = await authFunctions.adminLogin(email, name, picture);
  res.status(data.resultStatus.responseCode).send(data);
});

export const auth = router;