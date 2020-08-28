"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SystemUtils {
    static getDeviceID(self) {
        return new Promise((resolve, reject) => {
            var _a, _b;
            if ((_b = (_a = self) === null || _a === void 0 ? void 0 : _a.container) === null || _b === void 0 ? void 0 : _b.db) {
                self.container.db.getNodeType('system/platform', (err, docs) => {
                    var _a, _b, _c;
                    if (!err) {
                        if (((_a = docs) === null || _a === void 0 ? void 0 : _a.length) && ((_c = (_b = docs[0]) === null || _b === void 0 ? void 0 : _b.properties) === null || _c === void 0 ? void 0 : _c.deviceID)) {
                            resolve(docs[0].properties.deviceID.trim());
                        }
                        else {
                            reject('No deviceID');
                        }
                    }
                    else {
                        console.log(err);
                        reject(err);
                    }
                });
            }
            else {
                reject('No DB');
            }
        });
    }
    static getClientID(self) {
        return new Promise((resolve, reject) => {
            var _a, _b;
            if ((_b = (_a = self) === null || _a === void 0 ? void 0 : _a.container) === null || _b === void 0 ? void 0 : _b.db) {
                self.container.db.getNodeType('system/platform', (err, docs) => {
                    var _a, _b, _c, _d;
                    if (!err) {
                        if (((_a = docs) === null || _a === void 0 ? void 0 : _a.length) && ((_d = (_c = (_b = docs[0]) === null || _b === void 0 ? void 0 : _b.settings) === null || _c === void 0 ? void 0 : _c['client-id']) === null || _d === void 0 ? void 0 : _d.value)) {
                            resolve(docs[0].settings['client-id'].value.trim());
                        }
                        else {
                            reject('No clientID');
                        }
                    }
                    else {
                        console.log(err);
                        reject(err);
                    }
                });
            }
            else {
                reject('No DB');
            }
        });
    }
}
exports.default = SystemUtils;
//# sourceMappingURL=system-utils.js.map