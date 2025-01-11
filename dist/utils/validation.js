"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWithdrawalAmount = exports.sanitizePhone = exports.isValidPhoneNumber = exports.isValidEmail = void 0;
// Validation utilities
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
const isValidPhoneNumber = (phone) => {
    // Nigerian phone number format
    const phoneRegex = /^(\+?234|0)[789][01]\d{8}$/;
    return phoneRegex.test(phone);
};
exports.isValidPhoneNumber = isValidPhoneNumber;
const sanitizePhone = (phone) => {
    // Remove any non-digit characters
    const digits = phone.replace(/\D/g, '');
    // Convert to Nigerian format if needed
    if (digits.startsWith('0')) {
        return '234' + digits.substring(1);
    }
    else if (digits.startsWith('234')) {
        return digits;
    }
    return '234' + digits;
};
exports.sanitizePhone = sanitizePhone;
const validateWithdrawalAmount = (amount) => {
    return typeof amount === 'number' &&
        amount > 0 &&
        amount <= 1000000 && // Maximum withdrawal limit
        Number.isFinite(amount) &&
        Math.floor(amount) === amount; // Must be whole number
};
exports.validateWithdrawalAmount = validateWithdrawalAmount;
