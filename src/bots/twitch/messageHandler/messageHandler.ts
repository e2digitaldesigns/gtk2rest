import { MessageEvent } from "@twurple/easy-bot";
import * as botFunctions from "../functions";
import { logChatMessage } from "../../../routes/chatRelay/functions";
import { twitchChatEmoteParser } from "./functions";

export async function messageHandler(message: MessageEvent) {
  if (message.text === "!msg") {
    message?.reply("Testing 123 message");
  }

  const streamerChannel = message.broadcasterName;
  const chatterUserName = message.userName;
  const chatterUserId = message.userId;

  // Ignore messages from ignored users
  const ignoreList = await botFunctions.getIgnoreList(streamerChannel);
  if (ignoreList.includes(chatterUserName.toLowerCase())) return;

  // Get gtk user id from db
  const gtkUserId = await botFunctions.getGTKUserId(streamerChannel);
  if (!gtkUserId) return;

  // Get Twitch User Image
  const twitchUserImage = await message.getUser().then(user => user.profilePictureUrl);

  // Is chat sender following the channel
  const isFollowing = await botFunctions.isChatterFollowing(
    streamerChannel,
    chatterUserName,
    chatterUserId
  );

  // Log message to db
  logChatMessage(gtkUserId, {
    channel: streamerChannel.toLowerCase(),
    fontColor: "",
    image: twitchUserImage || "",
    message: message.text,
    msgEmotes: twitchChatEmoteParser(message.text, message.emoteOffsets),
    userId: chatterUserId,
    username: chatterUserName,
    platform: "twitch"
  });

  // Chat commands
}
