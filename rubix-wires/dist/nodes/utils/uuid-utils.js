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
    static createUUID() {
        let dt = new Date().getTime();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
        });
    }
    static create8DigId() {
        return (Math.random()
            .toString(36)
            .substr(2, 4) +
            '_' +
            Math.random()
                .toString(36)
                .substr(2, 4));
    }
    static isUUID(data) {
        const dataArray = data
            .toString()
            .trim()
            .split('-');
        return (dataArray.length === 5 &&
            dataArray[0].length === 8 &&
            dataArray[1].length === 4 &&
            dataArray[2].length === 4 &&
            dataArray[3].length === 4 &&
            dataArray[4].length === 12);
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
                yield file_utils_1.default.writeFile(`${dirPath}/${fileName}`, UuidUtils.createUUID());
            }
            catch (e) {
                throw e;
            }
        });
    }
}
exports.default = UuidUtils;
//# sourceMappingURL=uuid-utils.js.map