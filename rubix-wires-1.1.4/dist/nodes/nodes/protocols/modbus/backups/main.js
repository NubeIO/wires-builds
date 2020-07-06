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
class ModbusRTU {
    constructor() {
        this.exec = util.promisify(CP.exec);
        this.timeout = 50;
        this.rs485DeviceName = 'ttyUSB0';
        this.devicePath = '/dev/' + this.rs485DeviceName;
        this.baudrate = 9600;
        this.modbus_Master = new ModbusSer();
        this.isDeviceOk = false;
    }
    process() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(3333);
            let rx = yield this.checkRS485Device();
            if (rx) {
                this.delay(1000);
                this.modbus_Master.connectRTUBuffered('/dev/ttyUSB0', { baudRate: 9600 });
                console.log(44444);
                yield this.modbus_Master.setTimeout(this.timeout);
                console.log(this.modbus_Master);
                console.log(this.rs485DeviceName + ' is exist!');
            }
            else {
                console.log(this.rs485DeviceName + ' is not exist!');
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
    checkRS485Device() {
        return __awaiter(this, void 0, void 0, function* () {
            let rx = yield this.exec('ls /dev/ | grep ' + this.rs485DeviceName);
            console.log(rx);
            if (rx.stdout.includes(this.rs485DeviceName)) {
                this.isDeviceOk = true;
                console.log(2222);
            }
            else {
                this.isDeviceOk = false;
            }
            return new Promise((resolve, reject) => {
                if (this.isDeviceOk) {
                    console.log(3333);
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        });
    }
    delay(msec) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(true);
            }, msec);
        });
    }
    testProcess() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.delay(1000);
            yield this.modbus_Master.setID(1);
            yield this.readInputRegisters2(1, 2)
                .then(d => {
                console.log(d);
            })
                .catch(e => {
                if (e === undefined) {
                }
                else {
                    console.log(e);
                }
            });
        });
    }
    setSlaveID(id) {
        this.modbus_Master.setID(id);
    }
    readInputRegisters2(startAddress, readStatusNumber) {
        return new Promise((resolve, reject) => {
            console.log(this.modbus_Master);
            this.modbus_Master
                .readInputRegisters(startAddress, readStatusNumber)
                .then(d => {
                console.log('Received Coil data:', d.data);
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
    }
    readHoldingRegisters(startAddress, regNum) {
        return new Promise((resolve, reject) => {
            this.modbus_Master
                .readHoldingRegisters(startAddress, regNum)
                .then(d => {
                resolve(d.data);
            })
                .catch(e => {
                reject(e.message);
            });
        });
    }
    readInputRegisters(startAddress, regNum) {
        return new Promise((resolve, reject) => {
            this.modbus_Master
                .readInputRegisters(startAddress, regNum)
                .then(d => {
                resolve(d.data);
            })
                .catch(e => {
                reject(e.message);
            });
        });
    }
    writeSingleRegister(startAddress, regValue) {
        return new Promise((resolve, reject) => {
            this.modbus_Master
                .writeRegister(startAddress, regValue)
                .then(d => {
                resolve(d);
            })
                .catch(e => {
                reject(e.message);
            });
        });
    }
    writeRegisters(startAddress, regValues) {
        return new Promise((resolve, reject) => {
            this.modbus_Master
                .writeRegisters(startAddress, regValues)
                .then(d => {
                console.log('Write Holding Registers', d);
                resolve(d);
            })
                .catch(e => {
                reject(e.message);
            });
        });
    }
}
exports.ModbusRTU = ModbusRTU;
let a = new ModbusRTU();
console.log(a);
function aa() {
    return __awaiter(this, void 0, void 0, function* () {
        yield a
            .process()
            .then(e => console.log(e))
            .catch(err => err);
        yield a
            .testProcess()
            .then(e => console.log(e))
            .catch(err => err);
    });
}
aa();
//# sourceMappingURL=main.js.map