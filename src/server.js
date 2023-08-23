import express, { Router } from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";


const app = express();
const loggerMiddleware = morgan("dev");


app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views"); 
app.use(loggerMiddleware);
app.use("/", globalRouter);
app.use("/video", videoRouter);
app.use("/users", userRouter);

const PORT = 4000;

const handleListening = () => {
    console.log(`✅ app listening on port localhost:${PORT} 🚀`)
}

app.listen(PORT, handleListening);

