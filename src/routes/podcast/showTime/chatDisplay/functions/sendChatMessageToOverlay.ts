import { ChatLogModel } from "../../../../../models";
import { getSocketServer } from "../../../../../startUpServices/socket";
import { getTemplateFromUserId, mongoObjectId } from "utils";

export const sendChatMessageToOverlay = async (
  userId: string,
  messageId: string,
  showTime: number,
  transition: string
) => {
  try {
    const result = await ChatLogModel.findOne({ _id: mongoObjectId(messageId) });

    if (!result) {
      throw new Error("No chat message found");
    }

    const socketIO = getSocketServer();

    const nodeSendArray = {
      tid: await getTemplateFromUserId(userId),
      uid: userId,
      action: "showChatMessage",
      message: {
        _id: result?._id,
        broadcasterName: "remove-me",
        name: result?.username,
        msg: result?.message,
        msgEmotes: result?.msgEmotes,
        url: result?.image,
        fontColor: "white",
        showTime,
        transition
      },
      data: {}
    };

    socketIO.emit("gtkChatDisplay", nodeSendArray);

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
