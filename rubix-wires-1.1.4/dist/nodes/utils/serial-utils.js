"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SerialPort = require('serialport');
class SerialUtils {
    static listPorts() {
        return new Promise((resolve, reject) => {
            try {
                let portList = [];
                SerialPort.list().then(ports => {
                    ports.forEach(port => {
                        portList.push(port);
                    });
                    resolve(portList);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
}
exports.default = SerialUtils;
//# sourceMappingURL=serial-utils.js.map