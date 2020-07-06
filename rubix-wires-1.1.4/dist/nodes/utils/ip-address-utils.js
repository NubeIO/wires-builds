"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ip = require('ip');
const network = require('network');
const child_process_1 = require("child_process");
class IpAddressUtils {
    static getActiveNetworks() {
        return new Promise(resolve => {
            network.get_interfaces_list(function (err, obj) {
                if (err)
                    resolve();
                if (!obj)
                    resolve();
                resolve(obj);
            });
        });
    }
    static networkUpDown(iface, upDown) {
        return new Promise((resolve, reject) => {
            let command = `sudo ip link set ${iface} ${upDown}`;
            child_process_1.exec(command, (err, stdout, stderr) => {
                if (err) {
                    reject({ err, stderr });
                }
                else {
                    resolve(stdout);
                }
            });
        });
    }
    static checkIpValid(newIP, netNetmask, newGateway, newNameserver) {
        const checkIP = ip.isV4Format(newIP);
        const checkNetMask = ip.isV4Format(netNetmask);
        const checkGateway = ip.isV4Format(newGateway);
        const nameserver = ip.isV4Format(newNameserver);
        if (checkIP && checkNetMask && checkGateway && nameserver) {
            return true;
        }
        else
            return false;
    }
}
exports.default = IpAddressUtils;
//# sourceMappingURL=ip-address-utils.js.map