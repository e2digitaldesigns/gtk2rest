import { TwitchAuthModel } from "../../../models/twitchAuth.model";

export async function getStreamerData(streamerChannel: string) {
  const streamerData = await TwitchAuthModel.findOne({
    twitchUserName: streamerChannel
  }).select({ twitchUserId: 1, accessToken: 1, refreshToken: 1 });

  return streamerData;
}
