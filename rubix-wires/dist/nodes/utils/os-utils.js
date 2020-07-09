"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const os = require('os');
const pkg = require('../../../package.json');
class OsUtils {
    static execute(command, options) {
        return new Promise((resolve, reject) => {
            child_process_1.exec(command, options, (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                    return;
                }
                else {
                    resolve({
                        stdout: stdout,
                        stderr: stderr,
                    });
                }
            });
        });
    }
    static hostName() {
        return new Promise((resolve, reject) => {
            try {
                resolve(os.hostname());
            }
            catch (e) {
                reject('Unknown');
            }
        });
    }
    static getCurrentWiresVersion() {
        return new Promise((resolve, reject) => {
            try {
                resolve(pkg.version);
            }
            catch (e) {
                reject('Unknown');
            }
        });
    }
}
exports.default = OsUtils;
//# sourceMappingURL=os-utils.js.map