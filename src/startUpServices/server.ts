import { Server } from "http";
import express, { Express, NextFunction, Request, Response } from "express";
import { getSocketServer } from "./socket";

const app: Express = express();
app.use(require("cors")());

export const initializeServer = () => {
  try {
    const server: Server = app.listen(process.env.PORT, () =>
      console.log(`Server initialization successful, listening on port ${process.env.PORT}`)
    );

    return server;
  } catch (error) {
    console.error("Server initialization failed:", error);
    process.exit(1);
  }
};

app.get("/", async (req: Request, res: Response) => {
  res.send("GTK REST 3s Service");
});

app.get("/socket", async (req: Request, res: Response) => {
  res.send("GTK REST 3s Service");
  const io = getSocketServer();

  io.emit("customEvent", "Event emitted successfully");

  res.send("Event emitted successfully");
});
