"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
let ModbusSer = require('modbus-serial');
const util = require("util");
const CP = require("child_process");
let exec = util.promisify(CP.exec);
let timeout = 50;
let rs485DeviceName = 'ttyUSB1';
let devicePath = '/dev/' + rs485DeviceName;
let baudrate = 9600;
let modbus_Master = new ModbusSer();
let regStartAddress;
let registerNum;
let writeValue;
let isPortOk = false;
function mb() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('CALL mb');
        let rx = yield checkRS485Device();
        if (rx) {
            yield modbus_Master
                .connectRTUBuffered(devicePath, { baudRate: baudrate })
                .catch((err) => err);
            yield modbus_Master.setTimeout(timeout);
        }
        else {
            console.log(rs485DeviceName + ' is not exist!');
        }
        return new Promise((resolve, reject) => {
            if (rx) {
                console.log('return true');
                resolve(true);
            }
            else {
                resolve(false);
            }
        });
    });
}
function checkRS485Device() {
    return __awaiter(this, void 0, void 0, function* () {
        let rx = yield exec('ls /dev/ | grep ' + 'ttyUSB');
        console.log(rx);
        if (rx.stdout.includes(rs485DeviceName)) {
            isPortOk = true;
        }
        else {
            isPortOk = false;
            console.log('rx isDeviceOk' + isPortOk);
        }
        return new Promise((resolve, reject) => {
            if (isPortOk) {
                resolve(true);
                console.log('rx resolve(true)' + isPortOk);
            }
            else {
                resolve(false);
                console.log('rx resolve(false)' + isPortOk);
            }
        });
    });
}
function delay(msec) {
    console.log('CALL delay');
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, msec);
    });
}
function readInputRegisters2(id, startAddress, readStatusNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        yield modbus_Master.setID(id);
        return new Promise((resolve, reject) => {
            console.log('CALL readInputRegisters2');
            modbus_Master
                .readCoils(startAddress, readStatusNumber)
                .then(d => {
                resolve(d.data);
            })
                .catch(e => {
                if (e === undefined) {
                }
                else {
                    reject(e.message);
                }
            });
        });
    });
}
function aa() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mb()
            .then(e => console.log(e))
            .catch(err => console.log(err));
        yield readInputRegisters2(1, 1, 2)
            .then(e => console.log(e))
            .catch(err => console.log(err));
        yield readInputRegisters2(1, 1, 20)
            .then(e => console.log(e))
            .catch(err => console.log(err));
        yield readInputRegisters2(1, 1, 2)
            .then(e => console.log(e))
            .catch(err => console.log(err));
        yield readInputRegisters2(1, 1, 30)
            .then(e => console.log(e))
            .catch(err => console.log(err));
    });
}
aa();
//# sourceMappingURL=main2.js.map