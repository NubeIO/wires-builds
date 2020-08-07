const Bacnet = require('node-bacnet');
const bacnetClient = new Bacnet({ apduTimeout: 10000 });
const bacnet = require('node-bacnet');
const client = new bacnet();
client.readProperty({ address: '192.168.10.21', net: 3, adr: [100] }, { type: 1, instance: 1 }, 85, (err, value) => {
    console.log('value: ', value);
    console.log('err: ', err);
});
bacnetClient.writeProperty('192.168.0.235', { type: 1, instance: 88 }, 85, [{ type: Bacnet.enum.ApplicationTags.REAL, value: 22 }], { priority: 16 }, (err, value) => {
    console.log('value: ', value);
});
const knownDevices = [];
bacnetClient.on('iAm', device => {
    console.log('value: ', JSON.stringify(device));
    const address = device.header.sender;
    const deviceId = device.payload.deviceId;
    if (knownDevices.includes(deviceId))
        return;
    bacnetClient.readProperty(address, { type: 8, instance: deviceId }, Bacnet.enum.PropertyIdentifier.OBJECT_NAME, (err, value) => {
        if (err) {
            console.log('Found Device ' + deviceId + ' on ' + JSON.stringify(address));
            console.log(err);
        }
        else {
            bacnetClient.readProperty(address, { type: 8, instance: deviceId }, Bacnet.enum.PropertyIdentifier.OBJECT_NAME, (err2, valueVendor) => {
                if (value && value.values && value.values[0].value) {
                    console.log('Found Device ' + deviceId + ' on ' + JSON.stringify(address) + ': ' + value.values[0].value);
                }
                else {
                    console.log('Found Device ' + deviceId + ' on ' + JSON.stringify(address));
                    console.log('value: ', JSON.stringify(value));
                }
                if (!err2 && valueVendor && valueVendor.values && valueVendor.values[0].value) {
                    console.log('Vendor: ' + valueVendor.values[0].value);
                }
                console.log();
            });
        }
    });
    knownDevices.push(deviceId);
});
//# sourceMappingURL=bacnetTestScript.js.map