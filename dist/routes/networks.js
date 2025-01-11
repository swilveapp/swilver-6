"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const networks_1 = require("../controllers/networks");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', networks_1.getNetworks);
exports.default = router;
