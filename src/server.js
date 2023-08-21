import express, { Router } from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";


const app = express();
const loggerMiddleware = morgan("dev");
app.use(loggerMiddleware);




app.use("/", globalRouter);
app.use("/video", videoRouter);
app.use("/user", userRouter);

const PORT = 4000;

const handleListening = () => {
    console.log(`✅ app listening on port localhost:${PORT} 🚀`)
}

app.listen(PORT, handleListening);

// 2분 24초 4.2 부터 보면 돼