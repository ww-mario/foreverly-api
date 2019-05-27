export default fn => {
    return async (req, res, next) => {
        try {
            return await fn(req, res, next);
        } catch (e) {
            next(e);
        }
    }
}