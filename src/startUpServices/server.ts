import { Server } from "http";
import express, { Express, Request, Response } from "express";
import cors from "cors";

import { routing } from "../routes";

const app: Express = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

routing(app);

app.get("/", async (req: Request, res: Response) => {
  res.send("GTK REST 3s Service");
});
