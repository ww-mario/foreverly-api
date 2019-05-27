import { Client } from 'pg';

const client = new Client({
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
});

client.connect();

client.first = async (qs, params) => {
    return (await client.query(qs, params)).rows[0] || null;
};

export default client;
