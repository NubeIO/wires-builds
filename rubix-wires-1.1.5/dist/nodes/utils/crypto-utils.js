"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../config");
const CryptoJS = require('crypto-js');
class CryptoUtils {
}
exports.default = CryptoUtils;
CryptoUtils.encrypt = text => {
    return CryptoJS.AES.encrypt(text, config_1.default.secretKey).toString();
};
CryptoUtils.decrypt = cipherText => {
    return CryptoJS.AES.decrypt(cipherText, config_1.default.secretKey).toString(CryptoJS.enc.Utf8);
};
//# sourceMappingURL=crypto-utils.js.map