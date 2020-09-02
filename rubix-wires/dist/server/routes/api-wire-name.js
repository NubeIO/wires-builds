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
const WireNameDataSource_1 = require("../../database/datasource/WireNameDataSource");
let router = express.Router();
router.get('', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const wire = yield WireNameDataSource_1.default.getWireName();
            res.json(wire);
        }
        catch (e) {
            res.status(500).send(e);
        }
    });
});
router.put('', function ({ body }, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name } = body;
        try {
            yield WireNameDataSource_1.default.changeWireName(name);
            app_1.default.server.wireNameSocket.io.emit('wire-name-update', name);
            res.status(201).send(body);
        }
        catch (e) {
            res.status(500).send(e);
        }
    });
});
module.exports = router;
//# sourceMappingURL=api-wire-name.js.map