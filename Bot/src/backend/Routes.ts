import express from "express";
import * as Controller from "./Controller";
const Router = express.Router({ mergeParams: true });

Router.post("/play", Controller.play);
Router.post("/now", Controller.now);
Router.post("/remove", Controller.remove);
Router.post("/swap", Controller.swap);
Router.get("/list", Controller.list);

//router.post("/pause", controller.pause);
//router.post("/resume", controller.resume);
Router.post("/stop", Controller.stop);
Router.post("/clear", Controller.clear);
Router.post("/search", Controller.search);

Router.get("/sse", Controller.sse);

export default Router;
