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
const file_utils_1 = require("./file-utils");
class UuidUtils {
    static isUUID(data) {
        const dataArray = data
            .toString()
            .trim()
            .split('-');
        return dataArray.length >= 1 && dataArray[0].length === 8;
    }
    static isUUIDFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let fileContent = yield file_utils_1.default.readFile(filePath);
                if (fileContent) {
                    return UuidUtils.isUUID(fileContent);
                }
                else
                    return false;
            }
            catch (e) {
                return false;
            }
        });
    }
    static makeUUIDFile(dirPath, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield file_utils_1.default.createDirectory(dirPath);
                yield file_utils_1.default.writeFile(`${dirPath}/${fileName}`, UuidUtils.create8DigId());
            }
            catch (e) {
                throw e;
            }
        });
    }
}
exports.default = UuidUtils;
UuidUtils.createUUID = (a = '') => a
    ? ((Number(a) ^ (Math.random() * 16)) >> (Number(a) / 4)).toString(16)
    : `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, UuidUtils.createUUID);
UuidUtils.create8DigId = (a = '') => a
    ? ((Number(a) ^ (Math.random() * 16)) >> (Number(a) / 4)).toString(16)
    : `${1e7}`.replace(/[018]/g, UuidUtils.create8DigId);
UuidUtils.create12DigId = (a = '') => a
    ? ((Number(a) ^ (Math.random() * 16)) >> (Number(a) / 4)).toString(16)
    : `${1e7}-${4e3}`.replace(/[018]/g, UuidUtils.create12DigId);
//# sourceMappingURL=uuid-utils.js.map