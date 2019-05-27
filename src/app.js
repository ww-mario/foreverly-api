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

app.get('/version', (req, res) => res.send('Hi'));

// Custom error handler (must be used last)
app.use(errorHandler);

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${port}, let's do it!`);
});

export default app;
