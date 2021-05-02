"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.property = exports.isA = exports.isSubClass = void 0;
const isSubClass = (child, parent) => {
    return `is_subclass(${child}, ${parent}).\n`;
};
exports.isSubClass = isSubClass;
const isA = (child, parent) => {
    return `is_a(${child}, ${parent}).\n`;
};
exports.isA = isA;
const property = (child, parent) => {
    return `property(${child}, ${parent}).\n`;
};
exports.property = property;
//# sourceMappingURL=utils.js.map