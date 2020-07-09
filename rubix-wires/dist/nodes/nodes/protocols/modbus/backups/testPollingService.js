let ModbusRTU = require('modbus-serial');
let client485 = new ModbusRTU();
let devicesList = [
    [
        {
            cid: 10,
            id: 2,
            type: 'protocols/modbus/modbus-rtu-device',
            pos: [385, 242],
            size: [178, 81],
            settings: {
                name: { description: 'Device Name', value: 'Folder 12', type: 'string' },
                deviceEnable: { description: 'Device enable', value: false, type: 'boolean' },
                address: { description: 'Modbus address', value: 1, type: 'number' },
                ipAddress: { description: 'Network IP Address', value: '0.0.0.0', type: 'string' },
                ipPort: { description: 'Network Port Number', value: 8503, type: 'number' },
            },
            properties: {
                pointsList: {
                    points: {
                        input: [
                            {
                                coils: [
                                    [
                                        {
                                            cid: 12,
                                            id: 10,
                                            address: 1,
                                            name: 'Point Name',
                                            type: 1,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                        {
                                            cid: 12,
                                            id: 12,
                                            address: 2,
                                            name: 'Point Name',
                                            type: 1,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                        {
                                            cid: 12,
                                            id: 14,
                                            address: 1,
                                            name: 'Point Name',
                                            type: 1,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                        {
                                            cid: 12,
                                            id: 16,
                                            address: 2,
                                            name: 'Point Name',
                                            type: 1,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                        {
                                            cid: 12,
                                            id: 18,
                                            address: 1,
                                            name: 'Point Name',
                                            type: 1,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                        {
                                            cid: 12,
                                            id: 2,
                                            address: 1,
                                            name: 'Point Name',
                                            type: 1,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                        {
                                            cid: 12,
                                            id: 20,
                                            address: 2,
                                            name: 'Point Name',
                                            type: 1,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                        {
                                            cid: 12,
                                            id: 4,
                                            address: 2,
                                            name: 'Point Name',
                                            type: 1,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                    ],
                                ],
                                input: [
                                    [
                                        {
                                            cid: 12,
                                            id: 11,
                                            address: 1,
                                            name: 'Point Name',
                                            type: 2,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                        {
                                            cid: 12,
                                            id: 13,
                                            address: 3,
                                            name: 'Point Name',
                                            type: 2,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                        {
                                            cid: 12,
                                            id: 15,
                                            address: 1,
                                            name: 'Point Name',
                                            type: 2,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                        {
                                            cid: 12,
                                            id: 17,
                                            address: 3,
                                            name: 'Point Name',
                                            type: 2,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                        {
                                            cid: 12,
                                            id: 19,
                                            address: 1,
                                            name: 'Point Name',
                                            type: 2,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                        {
                                            cid: 12,
                                            id: 21,
                                            address: 3,
                                            name: 'Point Name',
                                            type: 2,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                        {
                                            cid: 12,
                                            id: 3,
                                            address: 1,
                                            name: 'Point Name',
                                            type: 2,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                        {
                                            cid: 12,
                                            id: 5,
                                            address: 3,
                                            name: 'Point Name',
                                            type: 2,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                    ],
                                ],
                                holdingRegisters: [
                                    [
                                        {
                                            cid: 12,
                                            id: 6,
                                            address: 1,
                                            name: 'Point Name',
                                            type: 3,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                    ],
                                ],
                                inputRegisters: [
                                    [
                                        {
                                            cid: 12,
                                            id: 7,
                                            address: 1,
                                            name: 'Point Name',
                                            type: 4,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                    ],
                                ],
                            },
                        ],
                        output: [
                            {
                                coil: [
                                    [
                                        {
                                            cid: 12,
                                            id: 8,
                                            address: 1,
                                            name: 'Point Name',
                                            type: 5,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                    ],
                                ],
                                register: [
                                    [
                                        {
                                            cid: 12,
                                            id: 9,
                                            address: 1,
                                            name: 'Point Name',
                                            type: 6,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                    ],
                                ],
                                coils: [[]],
                                registers: [[]],
                            },
                        ],
                    },
                },
            },
            flags: {},
            inputs: {
                '0': { setting: { exist: false, nullable: false }, name: 'connect', type: 'boolean' },
                '1': { setting: { exist: false, nullable: false }, name: 'get points', type: 'boolean' },
            },
            outputs: {
                '0': { name: 'status', type: 'boolean', links: null },
                '1': { name: 'error', type: 'string', links: null },
                '2': { name: 'message', type: 'json', links: null },
            },
            sub_container: { id: 12, last_node_id: 21, config: {}, serializedNodes: [] },
            _id: 'c10n2',
        },
        {
            cid: 10,
            id: 5,
            type: 'protocols/modbus/modbus-rtu-device',
            pos: [395, 388],
            size: [178, 81],
            settings: {
                name: { description: 'Device Name', value: 'Folder 21', type: 'string' },
                deviceEnable: { description: 'Device enable', value: false, type: 'boolean' },
                address: { description: 'Modbus address', value: 2, type: 'number' },
                ipAddress: { description: 'Network IP Address', value: '0.0.0.0', type: 'string' },
                ipPort: { description: 'Network Port Number', value: 503, type: 'number' },
            },
            properties: {
                pointsList: {
                    points: {
                        input: [
                            {
                                coils: [
                                    [
                                        {
                                            cid: 21,
                                            id: 1,
                                            address: 15,
                                            name: 'Point Name',
                                            type: 1,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                        {
                                            cid: 21,
                                            id: 10,
                                            address: 15,
                                            name: 'Point Name',
                                            type: 1,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                        {
                                            cid: 21,
                                            id: 11,
                                            address: 15,
                                            name: 'Point Name',
                                            type: 1,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                        {
                                            cid: 21,
                                            id: 12,
                                            address: 15,
                                            name: 'Point Name',
                                            type: 1,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                        {
                                            cid: 21,
                                            id: 4,
                                            address: 15,
                                            name: 'Point Name',
                                            type: 1,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                        {
                                            cid: 21,
                                            id: 5,
                                            address: 15,
                                            name: 'Point Name',
                                            type: 1,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                        {
                                            cid: 21,
                                            id: 6,
                                            address: 15,
                                            name: 'Point Name',
                                            type: 1,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                        {
                                            cid: 21,
                                            id: 7,
                                            address: 15,
                                            name: 'Point Name',
                                            type: 1,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                        {
                                            cid: 21,
                                            id: 8,
                                            address: 15,
                                            name: 'Point Name',
                                            type: 1,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                        {
                                            cid: 21,
                                            id: 9,
                                            address: 15,
                                            name: 'Point Name',
                                            type: 1,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                    ],
                                ],
                                input: [[]],
                                holdingRegisters: [
                                    [
                                        {
                                            cid: 21,
                                            id: 2,
                                            address: 6,
                                            name: 'Point Name',
                                            type: 3,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                    ],
                                ],
                                inputRegisters: [[]],
                            },
                        ],
                        output: [
                            {
                                coil: [[]],
                                register: [
                                    [
                                        {
                                            cid: 21,
                                            id: 3,
                                            address: 10,
                                            name: 'Point Name',
                                            type: 6,
                                            offset: 2,
                                            mathFunc: 0,
                                            mathValue: 1,
                                            dataType: 1,
                                            dataEndian: 0,
                                            inputValue: null,
                                        },
                                    ],
                                ],
                                coils: [[]],
                                registers: [[]],
                            },
                        ],
                    },
                },
            },
            flags: {},
            inputs: {
                '0': { setting: { exist: false, nullable: false }, name: 'connect', type: 'boolean' },
                '1': { setting: { exist: false, nullable: false }, name: 'get points', type: 'boolean' },
            },
            outputs: {
                '0': { name: 'status', type: 'boolean', links: null },
                '1': { name: 'error', type: 'string', links: null },
                '2': { name: 'message', type: 'json', links: null },
            },
            sub_container: { id: 21, last_node_id: 12, config: {}, serializedNodes: [] },
            _id: 'c10n5',
        },
    ],
];
let i, j, k;
let deviceAddr, pointListIns, pointListOuts, ipAddress, ipPort, deviceEnable, pointsList, deviceName;
let pointAddr;
let offset;
let name;
let type;
let cid;
let id;
let mathFunc;
let mathValue;
let dataType;
let dataEndian;
let nodeInputValue;
function getPoints(devices) {
    let pntList = [];
    let devList = [];
    let timeoutCount = 10;
    let status = 0;
    for (let device of devices) {
        for (i = 0; i < device.length; i++) {
            deviceAddr = device[i].settings.address.value;
            deviceName = device[i].settings.name.value;
            ipAddress = device[i].settings.ipAddress.value;
            ipPort = device[i].settings.ipPort.value;
            deviceEnable = device[i].settings.deviceEnable.value;
            pointListIns = device[i].properties.pointsList.points.input;
            pointListOuts = device[i].properties.pointsList.points.output;
            devList.push({
                Name: deviceName,
                Address: deviceAddr,
                Value: '-',
                Captures: 0,
                Errors: 0,
                ErrorPercent: 0,
            });
            for (j = 0; j < pointListIns.length; j++) {
                pointsList = pointListIns[j].coils[0];
                for (k = 0; k < pointsList.length; k++) {
                    id = pointsList[k].id;
                    pointAddr = pointsList[k].address;
                    type = pointsList[k].type;
                    name = pointsList[k].name;
                    pntList.push({
                        id: id,
                        deviceName: deviceName,
                        deviceAddr,
                        deviceAddr,
                        ipPort: ipPort,
                        ipAddress: ipAddress,
                        pointAddr: pointAddr,
                        type: type,
                        name: name,
                        timeoutCount: timeoutCount,
                        status: status,
                    });
                }
            }
            for (j = 0; j < pointListIns.length; j++) {
                pointsList = pointListIns[j].holdingRegisters[0];
                for (k = 0; k < pointsList.length; k++) {
                    id = pointsList[k].id;
                    pointAddr = pointsList[k].address;
                    type = pointsList[k].type;
                    name = pointsList[k].name;
                    pntList.push({
                        id: id,
                        deviceName: deviceName,
                        deviceAddr,
                        deviceAddr,
                        ipPort: ipPort,
                        ipAddress: ipAddress,
                        pointAddr: pointAddr,
                        type: type,
                        name: name,
                        timeoutCount: timeoutCount,
                        status: status,
                    });
                }
            }
            for (j = 0; j < pointListIns.length; j++) {
                pointsList = pointListIns[j].inputRegisters[0];
                for (k = 0; k < pointsList.length; k++) {
                    id = pointsList[k].id;
                    pointAddr = pointsList[k].address;
                    type = pointsList[k].type;
                    name = pointsList[k].name;
                    pntList.push({
                        id: id,
                        deviceName: deviceName,
                        deviceAddr,
                        deviceAddr,
                        ipPort: ipPort,
                        ipAddress: ipAddress,
                        pointAddr: pointAddr,
                        type: type,
                        name: name,
                        timeoutCount: timeoutCount,
                        status: status,
                    });
                }
            }
            for (j = 0; j < pointListIns.length; j++) {
                pointsList = pointListIns[j].input[0];
                for (k = 0; k < pointsList.length; k++) {
                    id = pointsList[k].id;
                    pointAddr = pointsList[k].address;
                    type = pointsList[k].type;
                    name = pointsList[k].name;
                    pntList.push({
                        id: id,
                        deviceName: deviceName,
                        deviceAddr,
                        deviceAddr,
                        ipPort: ipPort,
                        ipAddress: ipAddress,
                        pointAddr: pointAddr,
                        type: type,
                        name: name,
                        timeoutCount: timeoutCount,
                        status: status,
                    });
                }
            }
        }
        return {
            pntList: pntList,
            devList: devList,
        };
    }
}
client485
    .connectRTUBuffered('/dev/ttyUSB0', { baudRate: 9600, debug: true, autoOpen: false })
    .then(function () {
    client485.setTimeout(200);
})
    .catch(function (e) {
    console.log(e.message);
});
let aa = getPoints(devicesList);
let dev = aa.pntList;
let sensorsVal = aa.devList;
let activeDevices = () => dev.filter(d => d.status === 1);
let iter = 0;
let devices = () => {
    if (iter === 0 || activeDevices().length === 0) {
        return dev;
    }
    else {
        return activeDevices();
    }
};
let currentDeviceNum = 0;
let delayAfter = 100;
let checkEvery = 50;
function showTable() {
    console.log('callShowTable');
    if (currentDeviceNum < devices().length - 1) {
        currentDeviceNum += 1;
    }
    else {
        currentDeviceNum = 0;
        iter = iter < checkEvery ? iter + 1 : 0;
        console.table(sensorsVal);
    }
}
function read(idDevice) {
    let currentDevice = devices()[currentDeviceNum];
    client485.setID(idDevice);
    let funcType = null;
    let type = currentDevice.type;
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
    console.log(currentDevice.name);
    client485[funcType](currentDevice.pointAddr, 1)
        .then(function (data) {
        if (!currentDevice.status) {
            console.log(currentDevice.name + ' CONNECTED');
        }
        currentDevice.status = 1;
        currentDevice.timeoutCount = 0;
        let device;
        for (j = 0; j < sensorsVal.length; j++) {
            device = sensorsVal[j];
            if (device.Name === currentDevice.deviceName) {
                device.Captures++;
                device.ErrorsPercent =
                    parseInt((device.Errors / (device.Captures + device.Errors)) * 100 * 100) / 100;
            }
        }
        setTimeout(() => read(devices()[currentDeviceNum].deviceAddr), delayAfter);
        showTable();
    })
        .catch(function (e) {
        console.log(e);
        currentDevice.status = 1;
        if (currentDevice.status) {
            if (currentDevice.timeoutCount === 5) {
                console.log(currentDevice.name + ' DISCONNECTED');
                currentDevice.status = 0;
            }
            else {
                currentDevice.timeoutCount++;
                console.log(currentDevice.timeoutCount);
            }
        }
        let device;
        for (j = 0; j < sensorsVal.length; j++) {
            device = sensorsVal[j];
            if (device.Name === currentDevice.deviceName) {
                device.Value = currentDevice.status ? e.message : '-';
                device.Errors++;
                device.ErrorsPercent =
                    parseInt((device.Errors / (device.Captures + device.Errors)) * 100 * 100) / 100;
            }
        }
        console.log('IN CATCH 4');
        showTable();
        if (devices().length) {
            read(devices()[currentDeviceNum].deviceAddr);
        }
        else {
            retryConnect();
        }
    });
    if (iter !== 0 && !activeDevices().length) {
        console.log('No device found');
    }
}
let retryConnect = () => {
    setTimeout(() => {
        console.log('Retry Connection');
        if (devices().length) {
            read(devices()[currentDeviceNum].deviceAddr);
        }
        else {
            retryConnect();
        }
    }, 10);
};
setTimeout(() => read(devices()[currentDeviceNum].deviceAddr), 10);
//# sourceMappingURL=testPollingService.js.map