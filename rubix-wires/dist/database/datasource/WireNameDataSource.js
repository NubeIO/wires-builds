"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const config_1 = require("../../config");
const log = require('logplease').create('auth-database', { color: 4 });
const file_utils_1 = require("../../nodes/utils/file-utils");
const file = `${config_1.default.dataDir}/wire-name.txt`;
class WireNameDataSource {
    static getWireName() {
        return new Promise((resolve, reject) => {
            file_utils_1.default.createFile(file).then(() => {
                fs.readFile(file, { encoding: 'utf-8' }, (err, data) => {
                    if (err) {
                        reject(err);
                        log.error(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            });
        });
    }
    static changeWireName(wireName) {
        return new Promise((resolve, reject) => {
            file_utils_1.default.createFile(file).then(() => {
                fs.writeFile(file, wireName, err => {
                    if (err) {
                        reject(err);
                        log.error(err);
                    }
                    else {
                        resolve(wireName);
                    }
                });
            });
        });
    }
}
exports.default = WireNameDataSource;
//# sourceMappingURL=WireNameDataSource.js.map