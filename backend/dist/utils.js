"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortModels = exports.property = exports.isA = exports.isSubClass = void 0;
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
const sortModels = (models) => {
    if (!models) {
        const error = {
            status: 500,
            body: "No models to sort",
        };
        return error;
    }
    console.log("MODELS CALL:: ", models.Solver);
    console.log("MODELS:: ", models);
    if (models.Call.length > 1) {
        const error = {
            status: 500,
            body: "Could not sort models because multiple calls were detected",
        };
        return error;
    }
    models.Call[0].Witnesses.map((model) => {
        model.Value.sort((a, b) => a.split(",")[2].localeCompare(b.split(",")[2], "en", { numeric: true }));
    });
    const success = {
        status: 200,
        body: models,
    };
    return success;
};
exports.sortModels = sortModels;
//# sourceMappingURL=utils.js.map