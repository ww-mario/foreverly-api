import express from 'express';

import authMiddleware from '../auth/authMiddleware';
import UserManager from '../users/userManager';

import withCatch from './util/withCatch';

const userRouter = express.Router();

userRouter.use(authMiddleware);

userRouter.get(
    '/',
    withCatch(async (req, res) => {
        const { userId } = req.currentUser;

        const user = await UserManager.getUserById(userId);

        delete user.password;

        res.send({ user });
    })
);

export default userRouter;
