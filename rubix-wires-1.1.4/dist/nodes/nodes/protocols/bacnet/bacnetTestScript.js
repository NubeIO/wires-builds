const Bacnet = require('node-bacnet');
const bacnetClient = new Bacnet({ apduTimeout: 10000 });
bacnetClient.writeProperty('192.168.0.235', { type: 1, instance: 88 }, 85, [{ type: Bacnet.enum.ApplicationTags.REAL, value: 22 }], { priority: 16 }, (err, value) => {
    console.log('value: ', value);
});
//# sourceMappingURL=bacnetTestScript.js.map