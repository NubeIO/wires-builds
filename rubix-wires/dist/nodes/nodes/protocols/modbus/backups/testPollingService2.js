let ModbusRTU = require('modbus-serial');
let client485 = new ModbusRTU();
client485
    .connectRTUBuffered('/dev/ttyUSB0', { baudRate: 9600, debug: true, autoOpen: false })
    .then(function () {
    client485.setTimeout(2000);
})
    .catch(function (e) {
    console.log(e.message);
});
let sensorsVal = {
    TE: { 'Value': '-', 'Min': null, 'Max': null, 'Captures': 0, 'Errors': 0, '%Errors': 0 },
    LU: { 'Value': '-', 'Min': null, 'Max': null, 'Captures': 0, 'Errors': 0, '%Errors': 0 },
    EE: { 'Value': '-', 'Min': null, 'Max': null, 'Captures': 0, 'Errors': 0, '%Errors': 0 },
};
let dev = [
    {
        name: 'TE',
        id: 1,
        unit: '°C',
        type: 'float',
        register: [0, 1],
        timeoutCount: 10,
        statut: 0,
        func: 'readHoldingRegisters',
    },
    {
        name: 'TE',
        id: 1,
        unit: '°C',
        type: 'float',
        register: 1,
        timeoutCount: 10,
        statut: 0,
        func: 'readHoldingRegisters',
    },
    {
        name: 'LU',
        id: 2,
        unit: '%',
        type: 'int',
        register: 2,
        timeoutCount: 10,
        statut: 0,
        func: 'readHoldingRegisters',
    },
];
let activeDevices = () => dev.filter(d => d.statut === 1);
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
let delayAfter = 1000;
let checkEvery = 1000;
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
    client485[currentDevice.func](currentDevice.register, 2)
        .then(function (data) {
        if (!currentDevice.statut) {
            console.log(currentDevice.name + ' CONNECTED');
        }
        currentDevice.statut = 1;
        currentDevice.timeoutCount = 0;
        let dat;
        let nb = 1;
        if (currentDevice.name.length > 2)
            nb = 2;
        let type, name, unit;
        for (let i = 0; i < nb; i++) {
            console.log(currentDevice);
            type = currentDevice.type;
            name = currentDevice.name;
            unit = currentDevice.unit;
            dataa = nb > 1 ? data.data[i] : data.data;
            console.log(currentDevice.name);
            console.log(sensorsVal[name]);
        }
        setTimeout(() => read(devices()[currentDeviceNum].id), delayAfter);
        showTable();
    })
        .catch(function (e) {
        if (currentDevice.statut) {
            if (currentDevice.timeoutCount === 10) {
                console.log(currentDevice.name + ' DISCONNECTED');
                currentDevice.statut = 0;
            }
            else {
                currentDevice.timeoutCount++;
                console.log(currentDevice.timeoutCount);
            }
        }
        console.log('IN CATCH 2');
        let nb = 1;
        if (currentDevice.name.length > 2)
            nb = 2;
        console.log('IN CATCH 3');
        let name;
        for (let i = 0; i < nb; i++) {
            name = nb > 1 ? currentDevice.name.split('/')[i] : currentDevice.name;
            sensorsVal[name]['Value'] = currentDevice.statut ? e.message : '-';
            sensorsVal[name]['Errors']++;
            sensorsVal[name]['%Errors'] =
                parseInt((sensorsVal[name]['Errors'] /
                    (sensorsVal[name]['Captures'] + sensorsVal[name]['Errors'])) *
                    100 *
                    100) / 100;
        }
        console.log('IN CATCH 4');
        showTable();
        if (devices().length) {
            read(devices()[currentDeviceNum].id);
        }
        else {
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
            read(devices()[currentDeviceNum].id);
        }
        else {
            retryConnect();
        }
    }, 2000);
};
setTimeout(() => read(devices()[currentDeviceNum].id), 2000);
//# sourceMappingURL=testPollingService2.js.map