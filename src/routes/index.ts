import express, { Express } from "express";
import * as routes from "./routes";
import { sendTwitchChatMessage } from "../bots/twitch";

export const routing = (app: Express) => {
  const prefix = "/api/v1/";
  app.use(express.json());

  app.use(`${prefix}application-data`, routes.applicationData);
  app.use(`${prefix}chat-relay`, routes.chatRelay);
  app.use(`${prefix}chat-rank`, routes.chatRank);

  app.get("/", (req, res) => {
    sendTwitchChatMessage("icon33", "Hello World!");
    res.send("Hello World!");
  });
};
