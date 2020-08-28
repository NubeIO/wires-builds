"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const config_1 = require("../../config");
const log = require('logplease').create('auth-database', { color: 4 });
const io = require("socket.io-client");
const socket = io('/wire-name');
class WireNameDataSource {
    getWireName() {
        return new Promise((resolve, reject) => {
            fs.readFile(`${config_1.default.dataDir}/wire-name.db`, { encoding: 'utf-8' }, (err, data) => {
                if (err) {
                    reject(err);
                    log.error(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    }
    changeWireName(wireName) {
        return new Promise((resolve, reject) => {
            fs.writeFile(`${config_1.default.dataDir}/wire-name.db`, wireName, (err) => {
                if (err) {
                    reject(err);
                    log.error(err);
                }
                else {
                    resolve(wireName);
                }
            });
        });
    }
}
exports.default = WireNameDataSource;
//# sourceMappingURL=WireNameDataSource.js.map