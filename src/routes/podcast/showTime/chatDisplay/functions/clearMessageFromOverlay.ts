import { getSocketServer } from "../../../../../startUpServices/socket";

export const clearMessageFromOverlay = async (userId: string, templateId: string) => {
  try {
    const socketIO = getSocketServer();

    const nodeSendArray = {
      tid: templateId,
      uid: userId,
      action: "hideChatMessage"
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
