import cors from "cors";
import express from "express";
import config from "../config";
import Router from "./Routes";
import { Client } from "../Bot";

export const init = () => {
  const app = express();
  app.use(express.json());
  app.use(cors(config.corsOptions));

  app.use((req, res, next) => {
    req.body.kazagumo = Client.kazagumo;
    next();
  });

  app.use("/api/:guildID", Router);
  app.listen(config.expressPort, () => {
    console.log(`Express listening on ${config.expressPort}`);
  });
};
