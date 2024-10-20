import { ChatLogModel } from "../../../models";
import { sendChatData } from "./sendChatData";
import { sendChatRankData } from "../../chatRank/functions";
import { mongoObjectId } from "../../../utils/routeUtils";
import { generateId } from "../../../utils";

type TwitchMessage = {
  channel: string;
  image: string | null;
  message: string;
  fontColor: string;
  userId: string;
  username: string;
  msgEmotes: string;
  platform: string;
};

export const logChatMessage = async (userId: string, messageData: TwitchMessage) => {
  try {
    const chatMessage = await new ChatLogModel({
      channel: messageData.channel,
      fontColor: messageData.fontColor,
      gtkUserId: mongoObjectId(userId),
      image: messageData.image || "",
      message: messageData.message,
      msgEmotes: messageData.msgEmotes,
      platform: messageData.platform,
      tagId: generateId(),
      userId: messageData.userId,
      username: messageData.username
    });

    const result = await chatMessage.save();

    if (!result) {
      throw new Error("No chat message found");
    }

    sendChatData(userId);
    sendChatRankData(userId);

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {}
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
