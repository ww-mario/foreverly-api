import Authenticator from './authenticator';

export default (req, res, next) => {
    const token = req.headers.authorization.split('JWT ')[1];

    const user = Authenticator.decodeToken(token);

    // eslint-disable-next-line no-console
    console.log('Current User:', user);

    req.currentUser = user;

    next();
};
