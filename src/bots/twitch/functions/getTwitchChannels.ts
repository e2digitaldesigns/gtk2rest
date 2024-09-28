import { TwitchAuthModel } from "../../../models/twitchAuth.model";

export async function getTwitchChannels() {
  const allUsers = await TwitchAuthModel.find().select({
    twitchUserName: 1
  });

  const users = allUsers.map(user => user.twitchUserName);

  return users || [];
}
