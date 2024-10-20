import { MessageEvent } from "@twurple/easy-bot";
import { validatedCommand } from "./isCommandValid";
import { logChatVote } from "../../../../../routes/chatVoting/functions";
import { createHostVote } from "../../../../../utils";
import { over } from "lodash";

export const chatCommandParser = async (
  channel: string,
  gtkUserId: string,
  isFollowing: boolean,
  isStreamer: boolean,
  messageEvent: MessageEvent
) => {
  console.log({ channel, gtkUserId, isFollowing, isStreamer, messageText: messageEvent.text });

  const trimmedMessage = messageEvent.text.toLowerCase().trim();
  const [typedCommand, target] = trimmedMessage.split(" ");

  const validCommand = await validatedCommand(gtkUserId, typedCommand);

  console.log({ validCommand });

  if (!validCommand) {
    return;
  }

  const commandActions: { [key: string]: Function } = {
    "!v1": () => overlayVoting(messageEvent, typedCommand, messageEvent.userName, gtkUserId),
    "!v2": () => overlayVoting(messageEvent, typedCommand, messageEvent.userName, gtkUserId),
    "!v3": () => overlayVoting(messageEvent, typedCommand, messageEvent.userName, gtkUserId),
    "!v4": () => overlayVoting(messageEvent, typedCommand, messageEvent.userName, gtkUserId),
    "!sv1": () => overlayVoting(messageEvent, typedCommand, messageEvent.userName, gtkUserId),
    "!sv2": () => overlayVoting(messageEvent, typedCommand, messageEvent.userName, gtkUserId),
    "!sv3": () => overlayVoting(messageEvent, typedCommand, messageEvent.userName, gtkUserId),
    "!sv4": () => overlayVoting(messageEvent, typedCommand, messageEvent.userName, gtkUserId),

    "!win1": () => overlayVoting(messageEvent, typedCommand, messageEvent.userName, gtkUserId),
    "!win2": () => overlayVoting(messageEvent, typedCommand, messageEvent.userName, gtkUserId),
    "!win3": () => overlayVoting(messageEvent, typedCommand, messageEvent.userName, gtkUserId),
    "!win4": () => overlayVoting(messageEvent, typedCommand, messageEvent.userName, gtkUserId),

    "!d1": () => overlayVoting(messageEvent, typedCommand, messageEvent.userName, gtkUserId),
    "!d2": () => overlayVoting(messageEvent, typedCommand, messageEvent.userName, gtkUserId),
    "!d3": () => overlayVoting(messageEvent, typedCommand, messageEvent.userName, gtkUserId),
    "!d4": () => overlayVoting(messageEvent, typedCommand, messageEvent.userName, gtkUserId),

    "!dv": () => {
      logChatVote(gtkUserId, "dislike", messageEvent.userName, target, "username");
    },

    "!uv": () => {
      logChatVote(gtkUserId, "like", messageEvent.userName, target, "username");
    }
  };

  if (commandActions[typedCommand]) {
    await commandActions[typedCommand]();
  } else {
    console.error("chatCommandParser.ts", "No command found");
  }
};

export async function overlayVoting(
  messageEvent: MessageEvent,
  command: string,
  username: string,
  userId: string
) {
  // change me
  const vote = createHostVote(userId, command, "gtkVoting", "65a90a1a02aae02cdba1910d");
  console.log({ vote });
  messageEvent.reply(`@${username} voted for ${command}`);
}
