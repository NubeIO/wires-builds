"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../../node");
const container_1 = require("../../../container");
const utils_1 = require("./../../../utils");
let helpers = require('./helpers');
let ModbusRTU = require('modbus-serial');
class ModbusReadClientNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Modbus Client Read';
        this.description =
            'Modbus-client-read point nodes are used to read modbus values from modbus servers.  Modbus details are configured in settings.  ‘Modbus register offset’ setting can be used to return a range of modbus registers as an array of results. Math functions can be configured to be performed on the modbus value before being passed to ‘output’.';
        this.addOutput('output', node_1.Type.STRING);
        this.addOutput('out bytes', node_1.Type.STRING);
        this.addOutput('error', node_1.Type.STRING);
        this.settings['ip'] = { description: 'ip', value: '0.0.0.0', type: node_1.SettingType.STRING };
        this.settings['port'] = { description: 'port', value: 8502, type: node_1.SettingType.NUMBER };
        this.settings['slaveAddress'] = {
            description: 'Modbus Salve address',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['address'] = {
            description: 'Modbus Register address',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['offset'] = {
            description: 'Modbus Register offset',
            value: 2,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['operation'] = {
            description: 'Output type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 0, text: 'FC 1: Read Coils' },
                    { value: 1, text: 'FC 2: Read Discrete Inputs' },
                    { value: 2, text: 'FC 3: Read Holding Registers' },
                    { value: 3, text: 'FC 4: Read Input Registers' },
                ],
            },
            value: 0,
        };
        this.settings['math-function'] = {
            description: 'Apply an optional math function',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 0, text: 'null' },
                    { value: 1, text: 'multiply' },
                    { value: 2, text: 'divide' },
                    { value: 3, text: 'add' },
                    { value: 4, text: 'subtract' },
                ],
            },
            value: 0,
        };
        this.settings['math-value'] = {
            description: 'Apply an optional math value',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['data-type'] = {
            description: 'Set data type for Register',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 0, text: 'null' },
                    { value: 1, text: 'single' },
                    { value: 2, text: 'double' },
                ],
            },
            value: 0,
        };
        this.settings['data-endian'] = {
            description: 'Set Endian data type for Register',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 0, text: 'null' },
                    { value: 1, text: 'Big Endian' },
                    { value: 2, text: 'Little Endian' },
                ],
            },
            value: 0,
        };
    }
    onCreated() { }
    onAdded() { }
    emitResult(out, arr, err) {
        this.setOutputData(0, out);
        this.setOutputData(1, arr);
        this.setOutputData(2, err);
    }
    onInputUpdated() {
        if (this.side !== container_1.Side.server)
            return;
        let time = utils_1.default.getTimeStamp();
        let client = new ModbusRTU();
        let ip = this.settings['ip'].value;
        const port = this.settings['port'].value;
        var networkErrors = [
            'ESOCKETTIMEDOUT',
            'ETIMEDOUT',
            'ECONNRESET',
            'ECONNREFUSED',
            'EHOSTUNREACH',
        ];
        const mathFunction = this.settings['math-function'].value;
        const mathValue = parseFloat(this.settings['math-value'].value);
        const dataType = this.settings['data-type'].value;
        const dataEndian = this.settings['data-endian'].value;
        let read = (address, offset, operation) => {
            let endian = dataEndian;
            function convertType(endian) {
                if (endian == 1) {
                    return true;
                }
                else if (endian == 2) {
                    return false;
                }
            }
            if (operation == 0) {
                client
                    .readCoils(address, offset)
                    .then(r => {
                    this.emitResult(r.data[0], r.data, time);
                    client.close();
                })
                    .catch(e => {
                    this.emitResult(null, null, e.message);
                });
            }
            else if (operation == 1) {
                client
                    .readDiscreteInputs(address, offset)
                    .then(r => {
                    this.emitResult(r.data[0], r.data, time);
                    client.close();
                })
                    .catch(e => {
                    this.emitResult(null, null, e.message);
                    client.close();
                });
            }
            else if (operation == 2) {
                client
                    .readHoldingRegisters(address, offset)
                    .then(r => {
                    if (mathFunction == 0) {
                        if (dataType == 0) {
                            this.emitResult(r.data[0], r.data, time);
                            client.close();
                        }
                        else if (dataType == 1) {
                            this.emitResult(helpers.numfloat(r.data, convertType(endian)), r.data, time);
                            client.close();
                        }
                        else if (dataType == 2) {
                            this.emitResult(helpers.numdouble(r.data, convertType(endian)), r.data, time);
                            client.close();
                        }
                    }
                    else if (mathFunction == 1) {
                        if (dataType == 0) {
                            this.emitResult(r.data[0] * mathValue, r.data, time);
                            client.close();
                        }
                        else if (dataType == 1) {
                            this.emitResult(helpers.numfloat(r.data, convertType(endian)) * mathValue, r.data, time);
                            client.close();
                        }
                        else if (dataType == 2) {
                            this.emitResult(helpers.numdouble(r.data, convertType(endian)) * mathValue, r.data, time);
                            client.close();
                        }
                    }
                    else if (mathFunction == 2) {
                        if (dataType == 0) {
                            this.emitResult(r.data[0] / mathValue, r.data, time);
                            client.close();
                        }
                        else if (dataType == 1) {
                            this.emitResult(helpers.numfloat(r.data, convertType(endian)) / mathValue, r.data, time);
                            client.close();
                        }
                        else if (dataType == 2) {
                            this.emitResult(helpers.numdouble(r.data, convertType(endian)) / mathValue, r.data, time);
                            client.close();
                        }
                    }
                    else if (mathFunction == 3) {
                        if (dataType == 0) {
                            this.emitResult(r.data[0] + mathValue, r.data, time);
                            client.close();
                        }
                        else if (dataType == 1) {
                            this.emitResult(helpers.numfloat(r.data, convertType(endian)) + mathValue, r.data, time);
                            client.close();
                        }
                        else if (dataType == 2) {
                            this.emitResult(helpers.numdouble(r.data, convertType(endian)) + mathValue, r.data, time);
                            client.close();
                        }
                    }
                    else if (mathFunction == 4) {
                        if (dataType == 0) {
                            this.emitResult(r.data[0] - mathValue, r.data, time);
                            client.close();
                        }
                        else if (dataType == 1) {
                            this.emitResult(helpers.numfloat(r.data, convertType(endian)) - mathValue, r.data, time);
                            client.close();
                        }
                        else if (dataType == 2) {
                            this.emitResult(helpers.numdouble(r.data, convertType(endian)) - mathValue, r.data, time);
                            client.close();
                        }
                    }
                })
                    .catch(e => {
                    this.emitResult(null, null, e.message);
                });
            }
            else if (operation == 3) {
                client
                    .readInputRegisters(address, offset)
                    .then(r => {
                    if (mathFunction == 0) {
                        if (dataType == 0) {
                            this.emitResult(r.data[0], r.data, time);
                            client.close();
                        }
                        else if (dataType == 1) {
                            this.emitResult(helpers.numfloat(r.data, convertType(endian)), r.data, time);
                            client.close();
                        }
                        else if (dataType == 2) {
                            this.emitResult(helpers.numdouble(r.data, convertType(endian)), r.data, time);
                            client.close();
                        }
                    }
                    else if (mathFunction == 1) {
                        if (dataType == 0) {
                            this.emitResult(r.data[0] * mathValue, r.data, time);
                            client.close();
                        }
                        else if (dataType == 1) {
                            this.emitResult(helpers.numfloat(r.data, convertType(endian)) * mathValue, r.data, time);
                            client.close();
                        }
                        else if (dataType == 2) {
                            this.emitResult(helpers.numdouble(r.data, convertType(endian)) * mathValue, r.data, time);
                            client.close();
                        }
                    }
                    else if (mathFunction == 2) {
                        if (dataType == 0) {
                            this.emitResult(r.data[0] / mathValue, r.data, time);
                            client.close();
                        }
                        else if (dataType == 1) {
                            this.emitResult(helpers.numfloat(r.data, convertType(endian)) / mathValue, r.data, time);
                            client.close();
                        }
                        else if (dataType == 2) {
                            this.emitResult(helpers.numdouble(r.data, convertType(endian)) / mathValue, r.data, time);
                            client.close();
                        }
                    }
                    else if (mathFunction == 3) {
                        if (dataType == 0) {
                            this.emitResult(r.data[0] + mathValue, r.data, time);
                            client.close();
                        }
                        else if (dataType == 1) {
                            this.emitResult(helpers.numfloat(r.data, convertType(endian)) + mathValue, r.data, time);
                            client.close();
                        }
                        else if (dataType == 2) {
                            this.emitResult(helpers.numdouble(r.data, convertType(endian)) + mathValue, r.data, time);
                            client.close();
                        }
                    }
                    else if (mathFunction == 4) {
                        if (dataType == 0) {
                            this.emitResult(r.data[0] - mathValue, r.data, time);
                            client.close();
                        }
                        else if (dataType == 1) {
                            this.emitResult(helpers.numfloat(r.data, convertType(endian)) - mathValue, r.data, time);
                            client.close();
                        }
                        else if (dataType == 2) {
                            this.emitResult(helpers.numdouble(r.data, convertType(endian)) - mathValue, r.data, time);
                            client.close();
                        }
                    }
                })
                    .catch(e => {
                    this.emitResult(null, null, e.message);
                });
            }
        };
        let setClient = () => {
            const operation = this.settings['operation'].value;
            const address = this.settings['address'].value;
            const offset = this.settings['offset'].value;
            const slaveAddress = this.settings['slaveAddress'].value;
            client.setID(parseInt(slaveAddress));
            client.setTimeout(1000);
            read(address, offset, operation);
        };
        client
            .connectTCP(ip, { port: port })
            .then(setClient)
            .then(() => { })
            .catch(e => {
            if (e.errno) {
                if (networkErrors.includes(e.errno)) {
                }
            }
        });
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('protocols/modbus/modbus-client-read', ModbusReadClientNode);
//# sourceMappingURL=modbus-client-read.js.map