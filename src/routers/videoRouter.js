import express from "express";
import {
    postEdit,
    getEdit,
    watch,
    postUpload,
    getVideo,
} from "../controller/videoController";



const videoRouter = express.Router();

videoRouter.route("/upload").get(getVideo).post(postUpload);
videoRouter.get("/:id(\\d+)", watch);
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);

// /:id 가 먼저오면 all :id 됨 


export default videoRouter;