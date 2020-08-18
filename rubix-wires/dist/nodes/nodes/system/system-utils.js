"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SystemUtils {
    static getDeviceID(self) {
        return new Promise((resolve, reject) => {
            try {
                if (self.container && self.container.db) {
                    self.container.db.getNodeType('system/platform', (err, docs) => {
                        if (!err) {
                            if (docs && docs.length && docs[0] && docs[0].properties) {
                                if (docs[0].settings['deviceID'] === undefined)
                                    return;
                                resolve(docs[0].properties['deviceID'].trim());
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
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    static getClientID(self) {
        return new Promise((resolve, reject) => {
            try {
                if (self.container && self.container.db) {
                    self.container.db.getNodeType('system/platform', (err, docs) => {
                        if (!err) {
                            if (docs && docs.length && docs[0] && docs[0].settings) {
                                if (docs[0].settings['clientID'] === undefined)
                                    return;
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
            }
            catch (err) {
                console.log(err);
            }
        });
    }
}
exports.default = SystemUtils;
//# sourceMappingURL=system-utils.js.map