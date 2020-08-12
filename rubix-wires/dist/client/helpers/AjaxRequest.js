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
const AuthMixins_1 = require("../mixins/AuthMixins");
const Storage_1 = require("../helpers/Storage");
const Registry_1 = require("./Registry");
const _ = require("lodash");
class AjaxRequest {
    static ajax(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            if (_.isEmpty(settings.headers)) {
                settings['headers'] = {};
            }
            settings.headers['token'] = Storage_1.default.get(AuthMixins_1.AUTH_KEY, {}).token;
            try {
                return yield $.ajax(settings);
            }
            catch (e) {
                if (e.status === 403) {
                    Storage_1.default.remove(AuthMixins_1.AUTH_KEY);
                    Registry_1.default.getRouter().push({ name: 'splash' });
                }
                throw e;
            }
        });
    }
}
exports.default = AjaxRequest;
//# sourceMappingURL=AjaxRequest.js.map