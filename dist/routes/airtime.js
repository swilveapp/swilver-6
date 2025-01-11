"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const airtime_1 = require("../controllers/airtime");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.post('/purchase', airtime_1.purchaseAirtime);
exports.default = router;
