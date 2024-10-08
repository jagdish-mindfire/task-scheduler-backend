const CONSTANT_STRINGS = require('../constants/strings.json');
const logger = require('../libs/logger');

const globalErrorHandler = async (err, req, res, next) => {
    logger.error(err);
    // Respond with an appropriate error status and message
    res.status(err.status || 500).json({ error: err.message || CONSTANT_STRINGS.INTERNAL_SERVER_ERROR });
}
module.exports = globalErrorHandler;