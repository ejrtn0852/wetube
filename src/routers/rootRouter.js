import express from 'express';
import { getJoin, postJoin, login } from '../controller/userController';
import { trending,search } from '../controller/videoController';

const rootRouter = express.Router();

rootRouter.get('/', trending);
rootRouter.route('/join').get(getJoin).post(postJoin);
rootRouter.get('/login', login);
rootRouter.get('/search', search);

export default rootRouter;
