import mongoose from "mongoose";
import _sortBy from "lodash/sortBy";
import { EpisodeModel } from "../../../../models/episodes.model";
import { HostModel } from "../../../../models/hosts.model";
import { TemplateModel } from "../../../../models/templates.model";

const ObjectId = mongoose.Types.ObjectId;

export const fetchEpisodeHost = async (episodeId: string, userId: string) => {
  try {
    const availableHost = await HostModel.find({
      userId: new ObjectId(userId)
    }).select({
      __v: 0,
      socials: 0
    });

    const episodeHost = await EpisodeModel.findOne({
      _id: new ObjectId(episodeId),
      userId: new ObjectId(userId)
    }).select({
      templateId: 1,
      hosts: 1
    });
    // console.log(episodeHost?.hosts);

    const template = await TemplateModel.findOne({
      _id: episodeHost?.templateId
    }).select({
      maxHosts: 1
    });

    return {
      resultStatus: {
        success: true,
        errors: null,
        responseCode: 200,
        resultMessage: "Your request was successful."
      },
      result: {
        availableHosts: availableHost || [],
        episodeHosts: episodeHost?.hosts || [],
        maxHosts: template?.maxHosts || 1
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
