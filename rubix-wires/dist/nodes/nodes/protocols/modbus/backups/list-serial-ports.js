const SerialPort = require('serialport');
SerialPort.list().then(ports => ports.forEach(e => {
    const path = e.path;
    console.log(path);
}));
//# sourceMappingURL=list-serial-ports.js.map