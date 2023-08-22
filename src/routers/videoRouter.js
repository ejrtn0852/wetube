import express from "express";
import {see,edit,upload,deleteVideo} from "../controller/videoController";



const videoRouter = express.Router();

videoRouter.get("/upload", upload);
videoRouter.get("/:id(\\d+)", see);
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);
// /:id 가 먼저오면 all :id 됨 


export default videoRouter;