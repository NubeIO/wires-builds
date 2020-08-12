"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
const schemaMiddleware = (schema, property) => {
    return (req, res, next) => {
        const { error } = schema.validate(req[property]);
        const valid = error == null;
        if (valid) {
            next();
        }
        else {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            res.status(422).json({ error: message });
        }
    };
};
exports.schemaMiddleware = schemaMiddleware;
const isAuthenticated = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield app_1.default.db.isAuthenticated(token);
        return true;
    }
    catch (e) {
        return false;
    }
});
const authMiddleware = () => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers['token'];
        if (!token) {
            res.status(403).json({ error: 'Please provide token' });
            return;
        }
        if (yield isAuthenticated(token)) {
            next();
        }
        else {
            res.status(403).json({ error: 'Please provide valid token' });
        }
    });
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=middleware.js.map