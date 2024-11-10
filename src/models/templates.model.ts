import { model, Schema, Types } from "mongoose";

export type TemplateTickerConfig = {
	hasTitle: boolean;
};
export type TemplateTopicConfig = {
	allowNesting: boolean;
	hasImage: boolean;
	hasVideo: boolean;
};

export interface ILinkArray {
	name: string;
	param: string;
}

export interface ITemplateImages {
	contentBox: ITemplateImagesDefault;
	logo: ITemplateImagesDefault;
	sponsors: ITemplateImagesDefault;
	topic: ITemplateImagesDefault;
}

export interface ITemplateImagesDefault {
	maxAmount: number;
	width: number;
	height: number;
}

type TemplateTypes = "podcast" | "video";

export interface ITemplate {
	_id: Types.ObjectId;
	active: boolean;
	hasSponsor: boolean;
	iconBgColor: string;
	images: ITemplateImages;
	linkArray: ILinkArray[];
	maxHosts: number;
	name: string;
	thumbnail: string;
	tickerConfig: TemplateTickerConfig;
	topicConfig: TemplateTopicConfig;
	type: TemplateTypes;
	urlKey: string;
}

const TemplateSchema = new Schema<ITemplate>({
	_id: { type: Schema.Types.ObjectId },
	active: { type: Boolean, required: true, default: false },
	type: { type: String, required: true, default: "podcast" },
	name: { type: String, required: true, default: " " },
	urlKey: { type: String, required: true, default: " " },
	thumbnail: { type: String },
	iconBgColor: { type: String, required: true, default: "black" },
	maxHosts: { type: Number, required: true, default: 1 },
	tickerConfig: { type: String, required: true, default: { hasTitle: false } },
	topicConfig: {
		type: Object,
		required: true,
		default: {
			allowNesting: true,
			hasImage: true,
			hasVideo: true
		}
	},
	hasSponsor: { type: Boolean, required: true, default: false },
	images: { type: Object, required: true, default: {} },
	linkArray: { type: [], required: true }
});

export const TemplateModel = model("templates", TemplateSchema);
