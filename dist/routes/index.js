"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = void 0;
const auth_1 = __importDefault(require("./auth"));
const user_1 = __importDefault(require("./user"));
const wallet_1 = __importDefault(require("./wallet"));
const airtime_1 = __importDefault(require("./airtime"));
const data_1 = __importDefault(require("./data"));
const admin_1 = __importDefault(require("./admin"));
const payment_1 = __importDefault(require("./payment"));
const setupRoutes = (app) => {
    app.use('/api/auth', auth_1.default);
    app.use('/api/users', user_1.default);
    app.use('/api/wallet', wallet_1.default);
    app.use('/api/airtime', airtime_1.default);
    app.use('/api/data', data_1.default);
    app.use('/api/admin', admin_1.default);
    app.use('/api/payment', payment_1.default);
};
exports.setupRoutes = setupRoutes;
