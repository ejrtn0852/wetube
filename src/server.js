import './db';
import './models/Video';
import express, { Router } from 'express';
import morgan from 'morgan';
import session from "express-session";
import rootRouter from './routers/rootRouter';
import userRouter from './routers/userRouter';
import videoRouter from './routers/videoRouter';
import { localsMiddleware } from './middlewares.js/middlewares';

const app = express();
const logger = morgan('dev');

app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "Hello",
    resave:true,
    saveUninitialized: true,
}))
app.use(localsMiddleware);
app.use('/', rootRouter);
app.use('/video', videoRouter);
app.use('/users', userRouter);

export default app;
