import express from 'express';

import Authenticator from '../auth/authenticator';
import UserManager from '../users/userManager';

const authRouter = express.Router();

authRouter.post('/create', async (req, res) => {
    const { username, password, email } = req.body;

    const userId = await UserManager.createUser(username, password, email);

    let token = null;

    if (userId) {
        token = Authenticator.createToken(username, userId);
    }

    res.send({ token });
});

authRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const token = await Authenticator.login(username, password);

    if (token) {
        return res.send({ token });
    }

    return res.send({
        type: 'error',
        message: 'Invalid login'
    });
});

export default authRouter;
