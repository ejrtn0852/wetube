import express from "express";

import {
    registerView,
    createComment,
    removeComment,
} from "../controller/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.post("/videos/:id([0-9a-f]{24})/remove", removeComment);
export default apiRouter;
