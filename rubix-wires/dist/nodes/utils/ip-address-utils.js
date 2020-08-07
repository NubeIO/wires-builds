"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ip = require('ip');
const network = require('network');
const child_process_1 = require("child_process");
const cp = require('child_process');
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
    static bbbGetInterfaceDetails() {
        return new Promise((resolve, reject) => {
            cp.execSync('connmanctl services', (err, stdout, stderr) => {
                if (err) {
                    reject({ err, stderr });
                }
                else {
                    resolve(stdout
                        .toString()
                        .replace(/\s/g, '')
                        .substring(8));
                }
            });
        });
    }
    static bbbSetIPDHCP(iface) {
        return new Promise((resolve, reject) => {
            const setIpDHCP = `sudo connmanctl config ${iface} --ipv4 dhcp`;
            cp.execSync(setIpDHCP, (err, stdout, stderr) => {
                if (err) {
                    reject({ err, stderr });
                }
                else {
                    resolve(true);
                }
            });
        });
    }
    static bbbSetIPFixed(iface, ipAddress, subnetMask, gateway) {
        return new Promise((resolve, reject) => {
            const setIP = `sudo connmanctl config ${iface} --ipv4 manual ${ipAddress} ${subnetMask} ${gateway} --nameservers 8.8.8.8 8.8.4.4`;
            cp.execSync(setIP, (err, stdout, stderr) => {
                if (err) {
                    reject({ err, stderr });
                }
                else {
                    resolve(true);
                }
            });
        });
    }
}
exports.default = IpAddressUtils;
//# sourceMappingURL=ip-address-utils.js.map