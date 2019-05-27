import Authenticator from './authenticator';

/* 
   If this middleware fails, the error handler will catch the error
   from `Authenticator.decodeToken()` and make it into a correct response
*/

export default (req, res, next) => {
    const token = (req.headers.authorization || 'JWT ').split('JWT ')[1];

    const user = Authenticator.decodeToken(token);

    // eslint-disable-next-line no-console
    console.log('Current User:', user);

    req.currentUser = user;

    next();
};
