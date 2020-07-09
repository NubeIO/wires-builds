const WebSocket = require('ws');
var ModbusRTU = require('modbus-serial');
const clients = [];
const hosts = [];
var clientIndex = 0;
const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', ws => {
    ws.on('message', data => {
        const slave = JSON.parse(data);
        clientIndex = hosts.indexOf(slave.host);
        if (clientIndex === -1) {
            hosts.push(slave.host);
            clients.push(new ModbusRTU());
            clientIndex = clients.length - 1;
        }
        console.log(slave);
        console.log(clientIndex);
        console.log(data);
        switch (slave.option) {
            case 'connect':
                connectModbus(slave, ws);
                break;
            case 'disconnect':
                closeModbus(slave, ws);
                break;
            case 'read':
                slave.option = isModbusConnect(slave);
                readRegister(slave, ws);
                break;
            case 'scan':
                slave.option = isModbusConnect(slave);
                scanRegister(slave, ws);
                break;
            case 'write':
                slave.option = isModbusConnect(slave);
                writeRegister(slave, ws);
                break;
        }
    });
});
function isModbusConnect(slave) {
    return clients[clientIndex].isOpen ? slave.option : 'notconnect';
}
function connectModbus(slave, ws) {
    if (clients[clientIndex].isOpen && clientIndex != clients.length - 1) {
        clients[clientIndex].close();
    }
    try {
        clients[clientIndex].connectTCP(slave.host, { port: parseInt(slave.port) });
        clients[clientIndex].setID(1);
        setTimeout(() => {
            slave.option = isModbusConnect(slave);
            ws.send(JSON.stringify(slave));
        }, 1000);
    }
    catch (_a) {
        console.log('Cannot connect with modbus');
    }
}
function closeModbus(slave, ws) {
    clients[clientIndex].close();
    slave.option = 'notconnect';
    ws.send(JSON.stringify(slave));
}
function readRegister(register, ws) {
    if (register.option === 'notconnect') {
        ws.send(JSON.stringify(register));
    }
    else {
        address = parseInt(register.address);
        clients[clientIndex].readHoldingRegisters(address, 1).then(data => {
            register.value = data.data;
            ws.send(JSON.stringify(register));
        });
    }
}
function scanRegister(register, ws) {
    if (register.option === 'notconnect') {
        ws.send(JSON.stringify(register));
    }
    else {
        address = parseInt(register.address);
        client[clientIndex].readCoils(address, 1).then(data => {
            register.value = data.data;
            ws.send(JSON.stringify(register));
        });
    }
}
function writeRegister(register, ws) {
    if (register.option === 'notconnect') {
        ws.send(JSON.stringify(register));
    }
    else {
        address = parseInt(register.address);
        value = parseInt(register.value);
        clients[clientIndex].writeRegister(address, value).then(() => {
            ws.send(JSON.stringify(register));
        });
    }
}
//# sourceMappingURL=modbusWebSocketServer.js.map