import { TwitchAuthModel } from "../../../models/twitchAuth.model";

export async function getGTKUserId(twitchChannel: string): Promise<string | undefined> {
  try {
    const data = await TwitchAuthModel.findOne({
      twitchUserName: twitchChannel
    }).select({
      userId: 1
    });

    return data?.userId ? String(data.userId) : undefined;
  } catch (error) {
    console.error("Error getting user id from database:", error);
    return undefined;
  }
}
