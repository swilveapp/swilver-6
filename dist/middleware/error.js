"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
const errorHandler = (err, req, res, next) => {
    logger_1.logger.error(err);
    if (err instanceof errors_1.CustomError) {
        return res.status(err.statusCode).json({
            status: 'error',
            code: err.statusCode,
            message: err.message,
        });
    }
    return res.status(500).json({
        status: 'error',
        code: 500,
        message: 'Internal server error',
    });
};
exports.errorHandler = errorHandler;
