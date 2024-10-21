import JWT from "jsonwebtoken";
import { UsersModel } from "../../../models";

export const adminLogin = async (email: string, name: string, picture: string) => {
  const secretKey = process.env.JWT_SECRET_TOKEN as string;
  const options = { expiresIn: "24h" };

  try {
    const result = await UsersModel.findOneAndUpdate(
      { email },
      {
        name: name,
        picture: picture
      },
      { new: true, upsert: true }
    );

    const token = JWT.sign(
      {
        _id: result._id,
        name: result.name,
        picture: result.picture
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
        token
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
