"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const os = require('os');
const si = require('systeminformation');
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
    static cpuTemperature() {
        return new Promise((resolve, reject) => {
            try {
                resolve(si.cpuTemperature());
            }
            catch (e) {
                reject('Unknown');
            }
        });
    }
    static fsSize() {
        return new Promise((resolve, reject) => {
            try {
                resolve(si.fsSize());
            }
            catch (e) {
                reject('Unknown');
            }
        });
    }
    static systemInfo() {
        return new Promise((resolve, reject) => {
            try {
                const valueObject = {
                    cpu: '*',
                    osInfo: 'platform, release',
                    system: 'model, manufacturer',
                };
                resolve(si.get(valueObject));
            }
            catch (e) {
                reject('Unknown');
            }
        });
    }
    static systemTime() {
        return new Promise((resolve, reject) => {
            try {
                resolve(si.time());
            }
            catch (e) {
                reject('Unknown');
            }
        });
    }
    static systemMem() {
        return new Promise((resolve, reject) => {
            try {
                resolve(si.mem());
            }
            catch (e) {
                reject('Unknown');
            }
        });
    }
}
exports.default = OsUtils;
//# sourceMappingURL=os-utils.js.map