import express, { Request, Response } from "express";
import { socials } from "./commonSocials";
import { TemplateModel } from "../../models/templates.model";

const router = express.Router();

router.get("/", async (_, res: Response) => {
  try {
    const result = await TemplateModel.find();

    const returnData = {
      resultStatus: {
        errors: null,
        responseCode: 200,
        resultMessage: "Application data loaded successfully",
        success: true
      },
      result: {
        socials,
        templates: result
      }
    };

    res.status(200).json(returnData);
  } catch (error) {
    res.status(500).send({
      resultStatus: {
        success: false,
        errors: error,
        responseCode: 400,
        resultMessage: "Application data not loaded successfully"
      }
    });
  }
});

export const applicationData = router;
