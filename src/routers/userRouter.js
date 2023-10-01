import express from "express";
import {
    edit,
    logout,
    see,
    startGithubLogin,
    finishGithubLogin,
    getEdit,
    postEdit,
    getChangePassword,
    postChangePassword,
    startKakaoLogin,
    finishKakaoLogin,
    kakaoLogOut,
} from "../controller/userController";

import {
    protectorMiddleware,
    publicOnlyMiddleware,
    avatarUpload,
} from "../middlewares.js/middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter
    .route("/edit")
    .all(protectorMiddleware)
    .get(getEdit)
    .post(avatarUpload.single("avatar"), postEdit);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/kakao/start", publicOnlyMiddleware, startKakaoLogin);
userRouter.get("/kakao/finish", publicOnlyMiddleware, finishKakaoLogin);
userRouter
    .route("/change-password")
    .all(protectorMiddleware)
    .get(getChangePassword)
    .post(postChangePassword);
userRouter.get("/kakao/logout", kakaoLogOut);

userRouter.get("/:id", see);

export default userRouter;
