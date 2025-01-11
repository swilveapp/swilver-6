"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNumeric = exports.parseNumeric = void 0;
const parseNumeric = (value) => {
    if (typeof value === 'string') {
        return parseFloat(value);
    }
    return value;
};
exports.parseNumeric = parseNumeric;
const toNumeric = (value) => {
    return value.toFixed(2);
};
exports.toNumeric = toNumeric;
