"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../controllers/admin/users");
const commission_1 = require("../controllers/admin/commission");
const monitoring_1 = require("../controllers/admin/monitoring");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All admin routes require authentication and admin role
router.use(auth_1.authenticate);
router.use((0, auth_1.authorize)(['admin']));
// User management
router.get('/users', users_1.getUsers);
// Commission management
router.get('/commission-rates', commission_1.getCommissionRates);
router.post('/commission-rates', commission_1.createCommissionRate);
router.patch('/commission-rates/:rateId', commission_1.updateCommissionRate);
// Monitoring
router.get('/stats/transactions', monitoring_1.getTransactionStats);
exports.default = router;
