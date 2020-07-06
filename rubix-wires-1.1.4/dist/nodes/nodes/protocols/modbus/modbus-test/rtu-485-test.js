var ModbusRTU = require('modbus-serial');
var client = new ModbusRTU();
client.connectRTUBuffered('/dev/ttyUSB0', { baudRate: 9600 }, write);
function write() {
    client.setID(1);
    client.writeRegisters(5, [0, 0xffff]).then(read);
}
function read() {
    client.readHoldingRegisters(0, 2, function (err, data) {
        console.log(data.data);
    });
}
//# sourceMappingURL=rtu-485-test.js.map