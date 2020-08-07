const Bacnet = require('node-bacnet');
const bacnetClient = new Bacnet({ apduTimeout: 10000, interface: '192.168.0.2' });
bacnetClient.on('error', (err) => {
    console.error(err);
    bacnetClient.close();
});
bacnetClient.on('listening', () => {
    console.log('discovering devices for 30 seconds ...');
    bacnetClient.whoIs({ 'net': 3 });
    setTimeout(() => {
        bacnetClient.close();
        console.log('closed transport ' + Date.now());
    }, 30000);
});
const knownDevices = [];
bacnetClient.on('iAm', (device) => {
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
//# sourceMappingURL=testWhoIs.js.map