export default function errorHandler(err, req, res, next) {
    if (err) {
        return res.status(err.statusCode || 500).send({ 
            type: 'error', 
            message: (err.message || 'Unknown Error') 
        });
    }

    next();
}
