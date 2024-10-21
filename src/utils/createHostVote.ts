import { parseVotingAction } from "../routes/webSocket/functions";
import { getSocketServer } from "../startUpServices/socket";
import { generateId } from "./generateId";
import { generateEmojiArray } from "./podcastUtils";
import { getTemplateFromUserId } from "utils";

export const createHostVote = async (userId: string, action: string, socket: string) => {
  const socketIO = getSocketServer();
  const votingAction = parseVotingAction(action);
  if (!votingAction) {
    return false;
  }

  const nodeSendArray = {
    _id: generateId(),
    action: votingAction,
    createdAt: new Date(),
    emojis: generateEmojiArray(votingAction),
    host: action.charAt(action.length - 1),
    tid: await getTemplateFromUserId(userId),
    uid: userId
  };

  socketIO.emit(socket, nodeSendArray);
  return true;
};
