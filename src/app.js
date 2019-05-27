import express from 'express';

import errorHandler from './routes/util/errorHandler';

const port = 8080;
const app = express();

// JSON parser
app.use(express.json());

// Routers
import authRouter from './routes/auth';
import userRouter from './routes/user';

app.use('/auth', authRouter);
app.use('/user', userRouter);

// Version endpoint
let _cached_version;

app.get('/version', (req, res) => {
    if (_cached_version) {
        return res.send({ version: _cached_version });
    }

    return import('child_process').then(cp => {
        const version = (_cached_version = cp
            .execSync('git rev-parse --short HEAD')
            .toString('utf-8')
            .replace(/\n/, ''));
        return res.send({ version });
    });
});

// Custom error handler (must be used last)
app.use(errorHandler);

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${port}, let's do it!`);
});

export default app;
