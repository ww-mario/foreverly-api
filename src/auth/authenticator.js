import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import userManager from '../users/userManager';
import { jwtSecret } from '../../config';

export default class Authenticator {
    
    // Return a token or `false` on failure
    static async login(username, password) {
        const user = await userManager.getUserByUsername(username);

        if (!user) {
            return null;
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return null;
        }

        return Authenticator.createToken(username, user.user_id);
    }

    static createToken(username, userId) {
        return jwt.sign({ username, userId }, jwtSecret);
    }

    static decodeToken(token) {
        if (!token) {
            throw new Error('Invalid JWT token');
        }

        return jwt.verify(token, jwtSecret);
    }
}
