var ModbusRTU = require('modbus-serial');
var client = new ModbusRTU();
client.connectTCP('192.168.0.202', { port: 502 }, write);
client.setID(1);
function write() {
    client.setID(1);
    client
        .readCoils(0, 2)
        .then(read);
}
function read() {
    client.readHoldingRegisters(0, 1, function (err, data) {
        console.log(data);
        console.log(data.buffer);
    });
}
//# sourceMappingURL=tcp-test.js.map