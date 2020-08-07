const bacnet = require('node-bacnet');
const client = new bacnet();
const requestArray = [
    { objectId: { type: 8, instance: 4194303 }, properties: [{ id: 8 }] }
];
client.readPropertyMultiple('192.168.0.202', requestArray, (err, value) => {
    console.log('value: ', JSON.stringify(value));
});
//# sourceMappingURL=testBacnetRead.js.map