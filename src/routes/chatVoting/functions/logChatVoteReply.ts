export const logChatVoteReply = (
  action: "like" | "dislike",
  username: string,
  chatterUsername: string
): string => {
  const downVoteMessages = [
    "{chatter}, {votter} just gave your message the thumbs-down treatment. Ouch! 👎😅",
    "{chatter}, {votter} seems to think your message deserves a spot in the 'meh' hall of fame. 🙄😆",
    "{chatter}, {votter} just downvoted your message. Maybe it’s time for a joke upgrade? 🤔😂",
    "{chatter}, {votter} hit the downvote button. It’s not you, it’s... well, maybe it is you. 😬👎",
    "{chatter}, {votter} has officially declared your message as dog-water. Better luck next time! 😜🚫"
  ];

  const upVoteMessages = [
    "{chatter}, {votter} just gave your message a thumbs-up! Looks like you've got a fan! 👍😄",
    "{chatter}, {votter} thinks your message is pure gold and hit that upvote! 🥇✨",
    "{chatter}, {votter} just gave your message an upvote. You're on a roll! 🎉👏",
    "{chatter}, {votter} gave you an upvote. Looks like you're speaking their language! 🗣️💬",
    "{chatter}, {votter} just upvoted your message. You’re officially awesome! 🌟🚀"
  ];

  let replyMessage =
    action === "like"
      ? upVoteMessages[Math.floor(Math.random() * upVoteMessages.length)]
      : downVoteMessages[Math.floor(Math.random() * downVoteMessages.length)];

  replyMessage = replyMessage.replace("{votter}", username);
  replyMessage = replyMessage.replace("{chatter}", chatterUsername);

  return replyMessage;
};
