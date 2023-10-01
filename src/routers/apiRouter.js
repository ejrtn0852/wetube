import express from "express";

import {
    registerView,
    createComment,
    removeComment,
    commentError,
} from "../controller/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.delete("/videos/:video/comment/:commentId", removeComment);
apiRouter.post("/comments/error", commentError);
export default apiRouter;
