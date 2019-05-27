import { Client } from 'pg';

const client = new Client({
    user: 'foreverly',
    database: 'foreverly',
    password: 'forever',
    host: 'localhost',
    port: 5432
});

client.connect();

export default client;
