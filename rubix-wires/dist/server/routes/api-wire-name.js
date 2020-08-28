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
let router = express.Router();
router.get('', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const wire = yield app_1.default.db.getWireName();
        res.json(wire);
    });
});
router.put('', function ({ body }, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name } = body;
        yield app_1.default.db.changeWireName(name);
        app_1.default.server.wireNameSocket.io.emit('wire-name-update', name);
        res.send(body);
    });
});
module.exports = router;
//# sourceMappingURL=api-wire-name.js.map