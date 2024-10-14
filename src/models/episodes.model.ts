import { model, Schema, Types } from "mongoose";

export interface IEpisodeTicker {
  _id: string;
  title: string;
  text: string;
}

export interface IEpisodeHost {
  hostId: Types.ObjectId;
  seatNum: number;
}

export interface IEpisodeSocials {
  socialId: Types.ObjectId;
  order: number;
}

export interface IEpisodeTopicVotingOptions {
  label: string;
  value: string;
}

export interface TopicContent {
  type: string | null;
  file: string | null;
}

export interface IEpisodeTopic {
  _id: Types.ObjectId;
  desc: string;
  img: string;
  isChild: boolean;
  isParent: boolean;
  name: string;
  order: number;
  parentId: string;
  timer: number;
  articles: string;
  video: string;
  notes: string;
  chat: string;
  voting: boolean;
  votingOptions?: IEpisodeTopicVotingOptions[];
  content: TopicContent;
}

export type SponsorImages = {
  _id: Types.ObjectId;
  url: string;
};

export interface IEpisode {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  podcastName: string;
  name: string;
  active: boolean;
  airDate: string;
  current: boolean;
  hosts: IEpisodeHost[];
  number: string | number;
  socialNetworks: IEpisodeSocials[];
  templateId: Types.ObjectId;
  ticker: IEpisodeTicker[];
  topics: IEpisodeTopic[];
  contentBoxes: any[];
  sponsorBoxes: any[];
  sponsorImages: SponsorImages[];
  logo: string;
}

const TopicContentSchema = new Schema<TopicContent>({
  type: { type: String, required: true },
  file: { type: String, required: true }
});

const EpisodeHostSchema = new Schema<IEpisodeHost>({
  hostId: { type: Schema.Types.ObjectId },
  seatNum: { type: Number, required: true, default: 0 }
});

const EpisodeTopicSchema = new Schema<IEpisodeTopic>({
  desc: { type: String, required: false },
  img: { type: String, required: false },
  isChild: { type: Boolean, required: true, default: false },
  isParent: { type: Boolean, required: true, default: false },
  name: { type: String, required: true, default: " " },
  order: { type: Number, required: true, default: 0 },
  parentId: { type: String, default: " " },
  timer: { type: Number, required: true, default: 0 },
  articles: { type: String, required: false, default: "" },
  video: { type: String, required: false, default: "" },
  notes: { type: String, required: false, default: "" },
  chat: { type: String, required: false, default: "" },
  voting: { type: Boolean, required: true, default: false },
  content: { type: TopicContentSchema, required: true, default: { type: null, file: null } }
});

const SponsorSchema = new Schema<SponsorImages>({
  url: { type: String, required: true, default: "" }
});

const EpisodeSchema = new Schema<IEpisode>({
  userId: { type: Schema.Types.ObjectId, required: true },
  podcastName: { type: String, required: true, default: " " },
  name: { type: String, required: true, default: " " },
  active: { type: Boolean, required: true, default: false },
  airDate: {
    type: String,
    required: true,
    default: () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  },
  current: { type: Boolean, required: true, default: false },
  hosts: {
    type: [EpisodeHostSchema],
    required: true,
    default: []
  },
  number: { type: Number, required: true, default: 0 },
  socialNetworks: { type: [], required: true, default: [] },
  templateId: { type: Schema.Types.ObjectId },
  ticker: { type: [], required: true, default: [] },
  topics: { type: [EpisodeTopicSchema], required: true, default: [] },
  contentBoxes: { type: [], required: true, default: [] },
  sponsorBoxes: { type: [], required: true, default: [] },
  sponsorImages: { type: [SponsorSchema], required: true, default: [] },
  logo: { type: String, default: "" }
});

export const EpisodeModel = model("episodes", EpisodeSchema);
