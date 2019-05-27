import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserManager from '../users/userManager';

const throwJWTError = () => {
    const err = new Error('Invalid JWT');
    err.statusCode = 403;
    throw err;
};

export default class Authenticator {
    // Return a token or `false` on failure
    static async login(username, password) {
        const user = await UserManager.getUserByUsername(username);

        if (!user) {
            return null;
        }

        // Check the password hash
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return null;
        }

        return Authenticator.createToken(username, user.user_id);
    }

    static createToken(username, userId) {
        return jwt.sign({ username, userId }, process.env.JWT_SECRET);
    }

    static decodeToken(token) {
        if (!token) {
            throwJWTError();
        }

        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('JSON Web Token Error: ', e);
            throwJWTError();
        }
    }
}
