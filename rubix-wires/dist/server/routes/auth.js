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
const express = require("express");
const app_1 = require("../../app");
const middleware_1 = require("../middleware");
const Joi = require('@hapi/joi');
let router = express.Router();
const authUserSchema = Joi.object({
    username: Joi.string().min(5),
    password: Joi.string().min(5),
});
router.route('/user').post(middleware_1.schemaMiddleware(authUserSchema, 'body'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authUser = yield app_1.default.db.addAuthUser(req.body);
        res.status(201).send(authUser);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.route('/user').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authUser = yield app_1.default.db.getAuthUser();
        res.status(200).send(authUser);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.route('/users').delete(middleware_1.authMiddleware(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authUser = yield app_1.default.db.deleteAuthUsers();
        res.status(200).send(authUser);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.route('/login').post(middleware_1.schemaMiddleware(authUserSchema, 'body'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield app_1.default.db.getAuthToken(req.body);
        res.status(200).send({ token });
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
module.exports = router;
//# sourceMappingURL=auth.js.map