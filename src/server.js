import express, { Router } from "express";
import morgan from "morgan";




const app = express();
const loggerMiddleware = morgan("dev");
app.use(loggerMiddleware);

const globalRouter = express.Router();
const handleHome = (req,res) => res.send("Home");

globalRouter.get("/", handleHome);

const userRouter = express.Router();
const handleEditUser = (req,res) => res.send("Edit User")

userRouter.get("/edit", handleEditUser);

const videoRouter = express.Router();
const handleWatchVideo = (req, res) => res.send("Watch video");

videoRouter.get("/watch", handleWatchVideo);


app.use("/", globalRouter);
app.use("/video", videoRouter);
app.use("/user", userRouter);

const PORT = 4000;

const handleListening = () => {
    console.log(`✅ app listening on port localhost:${PORT} 🚀`)
}

app.listen(PORT, handleListening);

// 2분 24초 4.2 부터 보면 돼