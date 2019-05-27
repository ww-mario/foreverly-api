import bcrypt from 'bcrypt';

import client from '../db/client';
import { saltRounds } from '../../config';

export default class UserManager {
    // Create a user and return their user ID
    static async createUser(username, password, email) {
        const hashedPass = await bcrypt.hash(password, saltRounds);

        const qs = `
            INSERT INTO "user" (username, password, email)
            VALUES ($1, $2, $3)
            RETURNING "user".user_id
        `;

        try {
            return (await client.first(qs, [username, hashedPass, email]))
                .user_id;
        } catch (e) {
            throw new Error('Username or password already exists');
        }
    }

    static async getUserByUsername(username) {
        const qs = `
            SELECT * FROM "user"
            WHERE username = $1
        `;

        return await client.first(qs, [username]);
    }

    static async getUserById(userId) {
        const qs = `
            SELECT * FROM "user"
            WHERE user_id = $1
        `;

        return await client.first(qs, [userId]);
    }
}
