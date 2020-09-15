"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    static sendDeviceMessage(deviceNode, msg) {
        if (deviceNode['subscribeMessage'])
            deviceNode['subscribeMessage'](msg);
    }
    static getDevice(typeDevice, cidDevice, container_db) {
        return new Promise((resolve, reject) => {
            let query = { 'type': typeDevice, 'cid': cidDevice, 'settings.deviceEnable.value': true };
            container_db.getNodeByQuery(query, (err, docs) => {
                let output = [];
                if (!err) {
                    try {
                        docs.forEach(doc => {
                            const { cid, id, sub_container, settings } = doc;
                            output.push({
                                deviceCID: cid,
                                deviceID: id,
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
                            const { cid, id, settings, properties } = doc;
                            output.push({
                                pntCid: cid,
                                pntId: id,
                                pntAddr: properties.address,
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
}
exports.default = ModbusUtils;
//# sourceMappingURL=modbus-functions.js.map