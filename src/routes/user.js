import express from 'express';

import authMiddleware from '../auth/authMiddleware';
import UserManager from '../users/userManager';

const userRouter = express.Router();

userRouter.use(authMiddleware);

userRouter.get('/', async (req, res) => {
    const { userId } = req.currentUser;

    const user = await UserManager.getUserById(userId);

    delete user.password;

    res.send({ user });
});

export default userRouter;
