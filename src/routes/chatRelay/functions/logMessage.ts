import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

import { ChatLogModel } from "../../../models/chatLog.model";
import { sendChatData } from "../clientState";

type TwitchMessageTags = {
  color: string;
  emotes: string;
  id: string;
  "user-id": string;
  "display-name": string;
  username: string;
};

type TwitchMessage = {
  channel: string;
  image: string | null;
  message: string;
  tags: TwitchMessageTags;
};

export const logChatMessage = async (userId: string, messageData: TwitchMessage) => {
  try {
    const chatMessage = await new ChatLogModel({
      channel: messageData.channel.replace("#", "").toLowerCase(),
      fontColor: messageData.tags.color || "",
      gtkUserId: new ObjectId(userId),
      image: messageData.image || "",
      message: messageData.message,
      msgEmotes: twitchChatParser(messageData.message, messageData.tags.emotes),
      platform: "twitch",
      tagId: messageData.tags.id,
      userId: messageData.tags["user-id"],
      username: messageData.tags["display-name"] || messageData.tags.username
    });

    const result = await chatMessage.save();

    if (!result) {
      throw new Error("No chat message found");
    }

    sendChatData(userId);

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

function twitchChatParser(message: string, emotes: string): string {
  return message;
}
