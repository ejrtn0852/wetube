import express from "express";
import {edit} from "../controller/userController"

const userRouter = express.Router();


userRouter.get("/edit", edit);

export default  userRouter;