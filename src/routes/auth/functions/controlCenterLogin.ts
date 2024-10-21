import JWT from "jsonwebtoken";
import { TwitchAuthModel, UsersModel, UserTemplateModel } from "../../../models";
import { mongoObjectId } from "utils";

export const controlCenterLogin = async (email: string, name: string, picture: string) => {
  const secretKey = process.env.JWT_SECRET_TOKEN as string;
  const options = { expiresIn: "24h" };

  try {
    if (!email) {
      throw new Error("Email is required");
    }

    const user = await UsersModel.findOneAndUpdate(
      { email: email },
      {
        name: name,
        picture: picture
      },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    const twitchInfo = await TwitchAuthModel.findOne({ userId: mongoObjectId(user._id) });
    const templateInfo = await UserTemplateModel.findOne({ userId: mongoObjectId(user._id) });

    const token = JWT.sign(
      {
        _id: user._id,
        name: user.name,
        picture: user.picture,
        gtkAi: !!user.gtkAi,
        twitchUsername: twitchInfo?.twitchUserName || ""
      },
      secretKey,
      options
    );

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {
        token,
        templateId: templateInfo?.templateId || ""
      }
    };
  } catch (error) {
    return {
      resultStatus: {
        success: false,
        errors: error,
        responseCode: 400,
        resultMessage: "Your request failed."
      }
    };
  }
};
