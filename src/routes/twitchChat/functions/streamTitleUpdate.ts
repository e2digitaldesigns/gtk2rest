import axios from "axios";
import { EpisodeModel, TwitchAuthModel } from "../../../models";
import { mongoObjectId } from "../../../utils/routeUtils";
import { refreshTwitchStreamerToken } from "../../../bots/twitch/functions";

export const streamTitleUpdate = async (userId: string, episodeId: string, topicId: string) => {
  try {
    const episode = await EpisodeModel.aggregate([
      { $match: { _id: mongoObjectId(episodeId) } },
      { $unwind: "$topics" },
      { $match: { "topics._id": mongoObjectId(topicId) } },
      {
        $project: {
          podcastName: 1,
          name: 1,
          number: 1,
          "topics.chat": 1
        }
      }
    ]);

    if (episode.length === 0) throw new Error("No Episode Found");

    const topicChat = episode[0].topics.chat;

    const title = topicChat
      ? `${episode[0].podcastName} | Current Topic:  ${topicChat}`
      : `${episode[0].podcastName} | Episode: ${episode[0].number}: ${episode[0].name}`;

    await changeStreamData(userId, title);

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {
        response: "Channel Updated"
      }
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

export const changeStreamData = async (
  gtkUserId: string,
  title: string,
  streamerAccessToken: string | null = null
) => {
  try {
    const streamerData = await TwitchAuthModel.findOne({
      userId: mongoObjectId(gtkUserId)
    }).select({ twitchUserId: 1, accessToken: 1, refreshToken: 1 });

    if (!streamerData) throw new Error("No Streamer Data");

    const headers = {
      "Client-ID": process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${streamerAccessToken || streamerData.accessToken}`,
      "Content-Type": "application/json"
    };

    await axios.patch(
      `https://api.twitch.tv/helix/channels?broadcaster_id=${streamerData.twitchUserId}`,
      { title },
      { headers }
    );
  } catch (error) {
    if (streamerAccessToken) return;

    const accessToken = await refreshTwitchStreamerToken(gtkUserId);

    if (!accessToken) return;

    await changeStreamData(gtkUserId, title, accessToken);
  }
};
