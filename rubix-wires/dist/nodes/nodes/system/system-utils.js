"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SystemUtils {
    static getDeviceID(self) {
        return new Promise((resolve, reject) => {
            if (self.db) {
                self.db.getNodeType('system/platform', (err, docs) => {
                    if (!err) {
                        if (docs && docs.length && docs[0] && docs[0].settings) {
                            resolve(docs[0].settings['deviceID'].trim());
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
            if (self.db) {
                self.db.getNodeType('system/platform', (err, docs) => {
                    if (!err) {
                        if (docs && docs.length && docs[0] && docs[0].settings) {
                            resolve(docs[0].settings['clientID'].trim());
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