import express, { Express } from "express";
import * as routes from "./routes";

export const routing = (app: Express) => {
  const prefix = "/api/v1/";
  app.use(express.json());

  app.use(`${prefix}chat-relay`, routes.chatRelay);
};
