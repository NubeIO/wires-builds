"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PubSub = require('pubsub-js');
var ModbusPointType;
(function (ModbusPointType) {
    ModbusPointType["readCoils"] = "FC1 Read Coils";
    ModbusPointType["readDiscreteInputs"] = "FC2 Read Discrete Inputs";
    ModbusPointType["readHoldingRegisters"] = "FC3 Read Multiple Holding Registers";
    ModbusPointType["readInputRegisters"] = "FC4 Read Input Registers";
    ModbusPointType["writeCoil"] = "FC5 Write Single Coil";
    ModbusPointType["writeRegister"] = "FC6 Write Single Holding Register";
    ModbusPointType["writeCoils"] = "FC15 Write Multiple Coils";
    ModbusPointType["writeRegisters"] = "FC16 Write Multiple Holding Registers";
})(ModbusPointType || (ModbusPointType = {}));
class ModbusUtils {
    static sendPointMessage(pointNode, msg) {
        if (pointNode['subscribe'])
            pointNode['subscribe'](msg);
    }
    static sendPointError(pointNode, e) {
        if (pointNode['subscribeError'])
            pointNode['subscribeError'](e);
    }
    static sendDeviceError(deviceNode, e) {
        if (deviceNode['subscribeError'])
            deviceNode['subscribeError'](e);
    }
    static fcType(type) {
        let funcType = null;
        if (type === 1) {
            funcType = 'readCoils';
        }
        else if (type === 2) {
            funcType = 'readDiscreteInputs';
        }
        else if (type === 3) {
            funcType = 'readHoldingRegisters';
        }
        else if (type === 4) {
            funcType = 'readInputRegisters';
        }
        else if (type === 5) {
            funcType = 'writeCoil';
        }
        else if (type === 6) {
            funcType = 'writeRegister';
        }
        else if (type === 15) {
            funcType = 'writeCoils';
        }
        else if (type === 16) {
            funcType = 'writeRegisters';
        }
        return funcType;
    }
    static getDevice(typeDevice, cidDevice, container_db) {
        return new Promise((resolve, reject) => {
            let query = { 'type': typeDevice, 'cid': cidDevice, 'settings.deviceEnable.value': true };
            container_db.getNodeByQuery(query, (err, docs) => {
                let output = [];
                if (!err) {
                    try {
                        docs.forEach(doc => {
                            const { cid, id, name, sub_container, settings } = doc;
                            output.push({
                                deviceCID: cid,
                                deviceID: id,
                                deviceName: name,
                                deviceSubCID: sub_container.id,
                                deviceAddress: settings.address.value,
                                ipAddress: settings.ipAddress.value,
                                ipPort: settings.ipPort.value,
                                deviceTimeout: settings.deviceTimeout.value,
                                deviceAddressOffset: settings.deviceAddressOffset.value,
                            });
                        });
                    }
                    catch (err) {
                        reject(err);
                    }
                    resolve(output);
                }
                else {
                    reject(err);
                }
            });
        });
    }
    static getPoints(pointType, deviceObj, container_db) {
        return new Promise((resolve, reject) => {
            let query = {
                'type': pointType,
                'cid': deviceObj.deviceSubCID,
                'settings.pointEnable.value': true,
            };
            container_db.getNodeByQuery(query, (err, docs) => {
                let output = [];
                if (!err) {
                    try {
                        docs.forEach(doc => {
                            const { cid, id, name, settings, properties } = doc;
                            output.push({
                                pntCid: cid,
                                pntId: id,
                                pntAddr: settings.address.value,
                                pntName: name,
                                pntType: settings.pointType.value,
                                pntOffset: settings.offset.value,
                                pntMathFunc: settings.mathFunc.value,
                                pntMathValue: settings.mathValue.value,
                                pntDataType: settings.dataType.value,
                                pntDataEndian: settings.dataEndian.value,
                                pntTimeout: settings.pointTimeout.value,
                                pntVal: properties.pointVal,
                            });
                        });
                    }
                    catch (err) {
                        reject(err);
                    }
                    resolve({
                        deviceObj,
                        points: output,
                    });
                }
                else {
                }
            });
        });
    }
    static pointRespone(thisInstance, response, deviceAddr, pointAddr, type, sub_container_id, cid, id, ipAddress, ipPort) {
        let topic = `networks.network.modbus.rtu.${sub_container_id}.devices.device.${cid}.points.types.type.${type}.point.${id}.value`;
        let getType = ModbusUtils.fcType(type);
        PubSub.publish(topic, response);
    }
    static persistProperties(container, properties, id, cid) {
        if (!container.db)
            return;
        container.db.updateNode(id, cid, {
            $set: {
                properties: properties,
            },
        });
    }
    static persistSettings(container, settings, id, cid) {
        if (!container.db)
            return;
        container.db.updateNode(id, cid, {
            $set: {
                settings: settings,
            },
        });
    }
    static findNodeType(findType, container, sub_container, containerId, subContainerId) {
        return new Promise((resolve, reject) => {
            try {
                container.db.getNodeType(findType, (err, docs) => {
                    if (!err) {
                        let output = [];
                        if (containerId) {
                            docs.forEach(e => {
                                if (e.type === findType && e.cid === container.id) {
                                    output.push(e);
                                }
                            });
                        }
                        else if (subContainerId) {
                            docs.forEach(e => {
                                if (e.type === findType && e.cid === sub_container.id) {
                                    output.push(e);
                                }
                            });
                        }
                        else {
                            output.push(docs);
                        }
                        resolve(output);
                        return output;
                    }
                    else {
                        console.log(err);
                        reject(err);
                    }
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = ModbusUtils;
ModbusUtils.ModbusPointLoop = [
    { value: 1, text: ModbusPointType.readCoils },
    { value: 2, text: ModbusPointType.readDiscreteInputs },
    { value: 3, text: ModbusPointType.readHoldingRegisters },
    { value: 4, text: ModbusPointType.readInputRegisters },
    { value: 5, text: ModbusPointType.writeCoil },
    { value: 6, text: ModbusPointType.writeRegister },
    { value: 15, text: ModbusPointType.writeCoils },
    { value: 16, text: ModbusPointType.writeRegisters },
];
//# sourceMappingURL=modbus-functions.js.map