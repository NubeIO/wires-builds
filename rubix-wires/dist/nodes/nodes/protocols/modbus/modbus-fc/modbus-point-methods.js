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
const utils_1 = require("../../../../utils");
const modbus_point_byte_order_1 = require("./modbus-point-byte-order");
class ModbusMethods {
    static readBool(res) {
        return res.data[0];
    }
    static nubeAnalogueRead() {
        let pntDataType = 2;
        let pntDataEndian = 2;
        return [pntDataType, pntDataEndian];
    }
    static dataTypeCase(c) {
        const type16 = 1;
        const type32 = 2;
        const type64 = 4;
        switch (c) {
            case 1:
            case 2:
                return type16;
            case 3:
            case 4:
            case 5:
                return type32;
            case 8:
                return type64;
        }
    }
    static pntSwitch(type, regAddr, regLength, nodeInputValue, pntDataType, pntDataEndian) {
        return __awaiter(this, void 0, void 0, function* () {
            let funcType = null;
            let methodType = null;
            try {
                if (type === 1) {
                    funcType = 'readCoils';
                    methodType = [regAddr, regLength];
                }
                else if (type === 21) {
                    funcType = 'readCoils';
                    methodType = [regAddr, 1];
                }
                else if (type === 2) {
                    funcType = 'readDiscreteInputs';
                    methodType = [regAddr, regLength];
                }
                else if (type === 22) {
                    funcType = 'readDiscreteInputs';
                    methodType = [regAddr, 1];
                }
                else if (type === 3) {
                    funcType = 'readHoldingRegisters';
                    if (pntDataType !== 0) {
                        methodType = [regAddr, ModbusMethods.dataTypeCase(pntDataType)];
                    }
                    else
                        methodType = [regAddr, regLength];
                }
                else if (type === 23) {
                    funcType = 'readHoldingRegisters';
                    methodType = [regAddr, 2];
                }
                else if (type === 4) {
                    funcType = 'readInputRegisters';
                    if (pntDataType !== 0) {
                        methodType = [regAddr, ModbusMethods.dataTypeCase(pntDataType)];
                    }
                    else
                        methodType = [regAddr, regLength];
                }
                else if (type === 24) {
                    funcType = 'readInputRegisters';
                    methodType = [regAddr, 2];
                }
                else if (type === 5 || type === 25) {
                    funcType = 'writeCoil';
                    methodType = [regAddr, nodeInputValue];
                }
                else if (type === 6) {
                    funcType = 'writeRegister';
                    methodType = [regAddr, nodeInputValue];
                }
                else if (type === 16) {
                    funcType = 'writeRegisters';
                    methodType = [regAddr, modbus_point_byte_order_1.default.writeValue(nodeInputValue, pntDataType, pntDataEndian)];
                }
                return {
                    funcType: funcType,
                    methodType: methodType,
                };
            }
            catch (error) {
                console.log(`buffer readValue issue in modus-point-methods. Buffer.alloc ${error}`);
            }
        });
    }
}
exports.default = ModbusMethods;
ModbusMethods.modbusMethods = (thisInstance, id, type, regAddr, regLength, nodeInputValue, pntDataType, pntDataEndian, deviceAddressOffset) => __awaiter(void 0, void 0, void 0, function* () {
    let ft = yield ModbusMethods.pntSwitch(type, regAddr - deviceAddressOffset, regLength, nodeInputValue, pntDataType, pntDataEndian);
    yield thisInstance.setID(id);
    yield utils_1.default.sleep(5);
    return yield new Promise((resolve, reject) => {
        thisInstance[ft.funcType](...ft.methodType).then((res) => {
            if (type === 3 || type === 4) {
                if (pntDataType === 3 || pntDataType === 4) {
                    const payload = modbus_point_byte_order_1.default.readByteOrder(res.buffer, 0, pntDataType, pntDataEndian);
                    resolve({ res: res, payload: payload });
                }
                else {
                    resolve({ res: res, payload: res.data[0] });
                }
            }
            else if (type === 1 || type === 2 || type === 21 || type === 22) {
                const payload = ModbusMethods.readBool(res);
                resolve({ res: res, payload: payload });
            }
            else if (type === 23 || type === 24) {
                let nubeType = ModbusMethods.nubeAnalogueRead();
                const payload = modbus_point_byte_order_1.default.readByteOrder(res.buffer, 0, nubeType[0], nubeType[1]);
                resolve({ res: res, payload: payload });
            }
            else if (type === 5 || type === 6 || type === 16 || type === 25 || type === 26) {
                if (res) {
                    resolve({ res: res, payload: 'writeOk' });
                }
            }
        });
        setTimeout(() => {
            reject(`Fail to execute > id: ${id}, FC: ${ft.funcType}, regAddr: ${regAddr}, length: ${regLength} , writeVal: ${nodeInputValue}`);
        }, 1000);
    });
});
//# sourceMappingURL=modbus-point-methods.js.map