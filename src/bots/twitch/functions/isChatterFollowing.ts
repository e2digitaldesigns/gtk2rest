import axios from "axios";
import { TwitchEndPoints } from "../types";
import { getStreamerData } from "./getStreamerData";
import { refreshTwitchStreamerToken } from "./refreshTwitchStreamerToken";

export async function isChatterFollowing(
  streamerChannel: string,
  chatterUserName: string,
  chatterUserId: string,
  streamerAccessToken: string | null = null
): Promise<boolean> {
  const streamerData = await getStreamerData(streamerChannel);
  if (!streamerData || !chatterUserId) return false;

  const isFollowing = await axios
    .get(
      `${TwitchEndPoints.Followers}broadcaster_id=${streamerData.twitchUserId}&user_id=${chatterUserId}`,
      {
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${streamerAccessToken || streamerData.accessToken}`
        }
      }
    )
    .then(res => {
      return res.data.data.length > 0;
    })
    .catch(async () => {
      if (streamerAccessToken) {
        return false;
      } else {
        const refreshedAccessToken = await refreshTwitchStreamerToken(streamerChannel);
        return await isChatterFollowing(
          streamerChannel,
          chatterUserName,
          chatterUserId,
          refreshedAccessToken
        );
      }
    });

  return !!isFollowing;
}
