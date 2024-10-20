import { generateId } from "../globalUtils";
import { generateEmojiArray } from "../routes/podcast/_podcastUtils";
import { parseVotingAction } from "../routes/webSocket/functions";
import { getSocketServer } from "../startUpServices/socket";

export const createHostVote = (
  userId: string,
  action: string,
  socket: string,
  templateId: string
) => {
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
    tid: templateId,
    uid: userId
  };

  socketIO.emit(socket, nodeSendArray);
  return true;
};
