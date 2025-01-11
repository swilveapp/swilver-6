"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const token_1 = require("../services/auth/token");
const errors_1 = require("../utils/errors");
const authenticate = (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            throw new errors_1.UnauthorizedError('Invalid authorization header');
        }
        const token = authHeader.split(' ')[1];
        const decoded = (0, token_1.verifyToken)(token);
        req.user = {
            ...decoded,
            role: decoded.role, // Cast the role to UserRole type
            email: '', // Add a default empty email since it's required by AuthUser type
        };
        next();
    }
    catch (error) {
        next(new errors_1.UnauthorizedError('Invalid token'));
    }
};
exports.authenticate = authenticate;
const authorize = (roles) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new errors_1.UnauthorizedError());
        }
        if (!roles.includes(req.user.role)) {
            return next(new errors_1.ForbiddenError());
        }
        next();
    };
};
exports.authorize = authorize;
