import { Client } from 'pg';

const client = new Client({
    user: 'foreverly',
    database: 'foreverly',
    password: 'forever',
    host: 'localhost',
    port: 5432
});

client.connect();

client.first = async (qs, params) => {
    return (await client.query(qs, params)).rows[0] || null;
};

export default client;
