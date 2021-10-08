"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReadableConst = exports.primitive = exports.collaborative = exports.member = exports.responsible = exports.delegate = exports.roleProperty = exports.property = exports.isA = exports.isSubClass = void 0;
const converter = __importStar(require("number-to-words"));
const isSubClass = (child, parent) => {
    return `is_subclass(${exports.createReadableConst(child)}, ${exports.createReadableConst(parent)}).\n`;
};
exports.isSubClass = isSubClass;
const isA = (child, parent) => {
    return `is_a(${exports.createReadableConst(child)}, ${exports.createReadableConst(parent)}).\n`;
};
exports.isA = isA;
const property = (child, parent) => {
    return `property(${exports.createReadableConst(child)}, ${exports.createReadableConst(parent)}).\n`;
};
exports.property = property;
const roleProperty = (role) => {
    return `property(Ag, ${exports.createReadableConst(role)}), `;
};
exports.roleProperty = roleProperty;
const delegate = (abbreviation, quantity, agent) => {
    return `delegate(${abbreviation}, ${quantity}, ${exports.createReadableConst(agent)}) :- ${deploy(abbreviation)}`;
};
exports.delegate = delegate;
const responsible = (abbreviation) => {
    return `responsible(${abbreviation}, Ag) :- ${deploy(abbreviation)}`;
};
exports.responsible = responsible;
const deploy = (abbreviation) => {
    return `deploy(${abbreviation}), `;
};
const member = (agent) => {
    return `member(Ag, ${exports.createReadableConst(agent)}). \n`;
};
exports.member = member;
const collaborative = (abbreviation) => {
    return `collaborative(${abbreviation}) . \n`;
};
exports.collaborative = collaborative;
const primitive = (abbreviation) => {
    return `primitive(${abbreviation}) . \n`;
};
exports.primitive = primitive;
const createReadableConst = (input) => {
    if (!input) {
        console.log("No input");
        return null;
    }
    const readableConst = input
        .replace(/\d.{2}/g, numberConverter)
        .replace(/\s/g, "")
        .replace(/[æøå]/g, "");
    return readableConst.charAt(0).toLowerCase() + readableConst.slice(1);
};
exports.createReadableConst = createReadableConst;
const numberConverter = (stringNumber) => {
    console.log("Number converter match: ", stringNumber);
    const ordinals = ["st", "nd", "rd", "th"];
    if (ordinals.includes(stringNumber.slice(-2).toLowerCase())) {
        return converter.toWordsOrdinal(stringNumber.slice(0, -2));
    }
    return stringNumber.replace(/\d/g, converter.toWordsOrdinal);
};
//# sourceMappingURL=aspFunctions.js.map