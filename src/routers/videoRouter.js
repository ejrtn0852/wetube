import express from "express";
import {
    postEdit,
    getEdit,
    watch,
    postUpload,
    getVideo,
    deleteVideo,
} from "../controller/videoController";

import { protectorMiddleware } from "../middlewares.js/middlewares";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter
    .all(protectorMiddleware)
    .route("/:id([0-9a-f]{24})/edit")
    .get(getEdit)
    .post(postEdit);
videoRouter
    .route("/:id([0-9a-f]{24})/delete")
    .all(protectorMiddleware)
    .get(deleteVideo);
videoRouter
    .route("/upload")
    .all(protectorMiddleware)
    .get(getVideo)
    .post(postUpload);

// /:id 가 먼저오면 all :id 됨

export default videoRouter;
