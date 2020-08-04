/**
 * Handle all errors in the project
 */

class AppError extends Error {
    constructor(statusCode, message) {
        super(message);

        // this.message = message;
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'failed' : 'Error';

        // to show which file has the error
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;