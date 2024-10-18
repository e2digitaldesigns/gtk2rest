import { MessageEvent } from "@twurple/easy-bot";
import { validatedCommand } from "./isCommandValid";
import { logChatVote } from "../../../../../routes/chatVoting/functions";

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
    "!v1": () => overlayVoting(messageEvent, "!v1", messageEvent.userName, channel),
    "!v2": () => console.log("v2"),
    "!v3": () => console.log("v3"),
    "!v4": () => console.log("v4"),

    "!sv1": () => console.log("sv1"),
    "!sv2": () => console.log("sv2"),
    "!sv3": () => console.log("sv3"),
    "!sv4": () => console.log("sv4"),

    "!win1": () => console.log("win1"),
    "!win2": () => console.log("win2"),
    "!win3": () => console.log("win3"),
    "!win4": () => console.log("win4"),

    "!d1": () => console.log("d1"),
    "!d2": () => console.log("d2"),
    "!d3": () => console.log("d3"),
    "!d4": () => console.log("d4"),

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
  channel: string
) {
  messageEvent.reply(`@${username} voted for ${command}`);
}
