"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const password_1 = require("../services/auth/password");
const token_1 = require("../services/auth/token");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const errors_1 = require("../utils/errors");
const validation_1 = require("../utils/validation");
const register = async (req, res, next) => {
    try {
        const { email, password, fullName, phone, role = 'reseller' } = req.body;
        if (!(0, validation_1.isValidEmail)(email)) {
            throw new errors_1.BadRequestError('Invalid email format');
        }
        const existingUser = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.users.email, email),
        });
        if (existingUser) {
            throw new errors_1.BadRequestError('Email already registered');
        }
        const hashedPassword = await (0, password_1.hashPassword)(password);
        const apiCreds = role === 'api_user' ? (0, token_1.generateApiCredentials)() : {};
        const [user] = await db_1.db.transaction(async (tx) => {
            const [newUser] = await tx
                .insert(schema_1.users)
                .values({
                email,
                password: hashedPassword,
                fullName,
                phone,
                role,
                ...apiCreds,
            })
                .returning();
            await tx.insert(schema_1.wallets).values({
                userId: newUser.id,
            });
            return [newUser];
        });
        const token = (0, token_1.generateToken)({ userId: user.id, role: user.role });
        res.status(201).json({
            status: 'success',
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                    ...(role === 'api_user' ? apiCreds : {}),
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.users.email, email),
        });
        if (!user || !(await (0, password_1.verifyPassword)(password, user.password))) {
            throw new errors_1.UnauthorizedError('Invalid credentials');
        }
        const token = (0, token_1.generateToken)({ userId: user.id, role: user.role });
        res.json({
            status: 'success',
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
