import express, { Express } from "express";
import * as routes from "./routes";

export const routing = (app: Express) => {
	const prefix = "/api/v1/";
	app.use(express.json());

	app.use(`${prefix}application-data`, routes.applicationData);
	app.use(`${prefix}auth`, routes.auth);
	app.use(`${prefix}chat-relay`, routes.chatRelay);
	app.use(`${prefix}chat-rank`, routes.chatRank);
	app.use(`${prefix}chat-voting`, routes.chatVoting);
	app.use(`${prefix}episodes`, routes.episodes);
	app.use(`${prefix}episode-segments`, routes.episodeSegments);
	app.use(`${prefix}episode-topics`, routes.episodeTopics);
	app.use(`${prefix}episode-topics-upload`, routes.episodeTopicsUpload);

	app.use(`${prefix}podcast-socials`, routes.socialNetworks);
	app.use(`${prefix}podcast-hosts`, routes.podcastHosts);
	app.use(`${prefix}podcast-commands`, routes.podcastCommands);
	app.use(`${prefix}podcast-canned-messages`, routes.podcastMessages);
	app.use(`${prefix}twitch-chat`, routes.twitchChat);

	app.use(`${prefix}episode-data`, routes.episodeData);

	app.use(`${prefix}socket`, routes.socket);
	app.use(`${prefix}templates`, routes.templates);
	app.use(`${prefix}chat-display`, routes.chatDisplay);
	app.use(`${prefix}user-templates`, routes.userTemplates);

	app.get("/", async (_, res) => {
		res.json({ msg: "Hello World!" });
	});
};
