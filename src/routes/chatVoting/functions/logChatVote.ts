import { sendTwitchChatMessage } from "../../../bots/twitch";
import { ChatLogModel, ChatVotingModel } from "../../../models";
import { mongoObjectId } from "../../../utils/routeUtils";
import { logChatVoteReply } from "./logChatVoteReply";
import { sendChatVotingData } from "./sendChatVotingData";

const voteValues: { [key: string]: number } = {
  like: 1,
  dislike: -1
};

export const logChatVote = async (
  userId: string,
  action: "like" | "dislike",
  hostUsername: string,
  searchFor: string,
  searchField: "_id" | "username" = "_id"
) => {
  try {
    const searchParams =
      searchField === "_id"
        ? { _id: mongoObjectId(searchFor) }
        : { username: searchFor.replace("@", "") };

    const result = await ChatLogModel.findOne(searchParams);

    if (!result) {
      throw new Error("No chat message found");
    }

    const newChatLike = new ChatVotingModel({
      channel: result.channel,
      gtkUserId: mongoObjectId(userId),

      hostUsername: hostUsername || " ",
      chatterUsername: result.username,
      chatterImage: result.image,
      votes: voteValues[action]
    });

    const saved = await newChatLike.save();

    sendChatVotingData(userId);

    //Send reply to chat
    const message = logChatVoteReply(action, hostUsername, result.username);
    sendTwitchChatMessage(result.channel, message);

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
