const globalErrorHandler = async (err, req, res, next) => {
    console.log(err);
    // Respond with an appropriate error status and message
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
}
module.exports = globalErrorHandler;