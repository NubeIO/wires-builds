"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../../node");
const container_1 = require("../../../container");
const serial_utils_1 = require("../../../utils/serial-utils");
const SerialPort = require('serialport');
class SerialConnectorNode extends node_1.Node {
    constructor() {
        super();
        this.baudRates = [110, 300, 600, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, 115200, 128000, 256000];
        this.isConnected = false;
        this.port = null;
        this.title = 'Serial Connector';
        this.description =
            'This node reads/writes serial data from/to the onboard serial ports.  These ports can be RS485 ports, or Rubix Compute wireless interface ports.  Once the Port and Baud Rate settings are configured, when enabled, the ‘output’ will be raw messages received over the configured serial port.  Any values written to the ‘writeValue’ input will be sent on the configured serial port.';
        this.addInput('writeValue', node_1.Type.STRING);
        this.addInput('enable', node_1.Type.BOOLEAN);
        this.addInput('list-ports', node_1.Type.BOOLEAN);
        this.addOutput('output', node_1.Type.STRING);
        this.addOutput('error', node_1.Type.STRING);
        this.addOutput('status', node_1.Type.BOOLEAN);
        this.addOutput('active-ports', node_1.Type.BOOLEAN);
        this.settings['port'] = {
            description: 'Serial Port',
            value: '/dev/ttyUSB2',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: '/dev/ttyUSB2', text: 'RS485-1 (/dev/ttyUSB2)' },
                    { value: '/dev/ttyUSB3', text: 'RS485-2 (/dev/ttyUSB3)' },
                    { value: '/dev/ttyUSB1', text: 'Xbee-1 (/dev/ttyUSB1)' },
                    { value: '/dev/ttyUSB0', text: 'Xbee-2 (/dev/ttyUSB0)' },
                    { value: '/dev/ttyAMA0', text: 'Xbee-3 (/dev/ttyAMA0)' },
                    { value: '/dev/ttyUSB4', text: 'USB Port (/dev/ttyUSB4)' },
                    { value: '/dev/ttyS1', text: 'Edge28 Expansion (/dev/ttyS1)' },
                ],
            },
        };
        this.settings['baudRate'] = {
            description: 'Baud rate',
            value: this.baudRates[6],
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: this.baudRates.map(baudRate => {
                    return { value: baudRate, text: baudRate };
                }),
            },
        };
        this.setOutputData(0, null);
        this.setOutputData(1, false);
        this.setOutputData(2, null);
    }
    onInputUpdated() {
        if (!this.isConnected) {
            this.connectToSerialPort();
        }
        else if (this.isConnected && !this.getInputData(1)) {
            this.isConnected = false;
            this.clearOutputs();
            this.closePort();
            return;
        }
        this.writePortData(this.getInputData(0));
        if (this.getInputData(2) === true) {
            this.listPorts();
        }
    }
    onAfterSettingsChange() {
        this.connectToSerialPort();
    }
    onRemoved() {
        this.closePort();
    }
    connectToSerialPort() {
        if (this.side !== container_1.Side.server)
            return;
        this.clearOutputs();
        this.closePort();
        if (!this.getInputData(1))
            return;
        let portName = this.settings['port'].value;
        let baudRate = this.settings['baudRate'].value;
        if (!portName) {
            this.debugErr('Port name is not defined!');
            this.setOutputData(1, 'Port name is not defined!');
            return;
        }
        this.port = new SerialPort(portName, { baudRate: baudRate, autoOpen: false });
        this.port.on('open', () => {
            this.isConnected = true;
            this.setOutputData(2, this.isConnected);
            this.debugInfo('Port connected');
        });
        this.port.on('error', err => {
            this.port = null;
            this.isConnected = false;
            this.setOutputData(1, err.message);
            this.setOutputData(2, this.isConnected);
            this.debugErr(err.message);
        });
        this.port.on('close', () => {
            this.debugInfo(this.isConnected ? 'Port closed. Gateway disconnected.' : 'Port closed');
            this.isConnected = false;
            this.setOutputData(2, this.isConnected);
        });
        this.port.on('disconnect', () => {
            this.isConnected = false;
            this.setOutputData(2, this.isConnected);
            this.debugInfo('Disconnected');
        });
        const Readline = SerialPort.parsers.Readline;
        const parser = this.port.pipe(new Readline({ delimiter: '\n' }));
        parser.on('data', data => this.readPortData(data));
        this.debugInfo('Connecting to ' + portName + ' at ' + baudRate + '...');
        this.port.open();
    }
    clearOutputs() {
        this.setOutputData(0, null);
        this.setOutputData(1, null);
        this.setOutputData(2, false);
    }
    listPorts() {
        serial_utils_1.default.listPorts()
            .then(e => {
            this.setOutputData(3, e);
        })
            .catch(err => {
            this.setOutputData(3, err);
        });
    }
    closePort() {
        if (this.port) {
            this.port.close();
        }
        this.port = null;
    }
    readPortData(data) {
        this.setOutputData(0, data);
    }
    writePortData(message) {
        if (message) {
            try {
                message = Buffer.from(JSON.parse(message));
            }
            catch (e) { }
            try {
                this.port.write(message);
            }
            catch (e) {
                this.setOutputData(1, e.message);
            }
        }
    }
}
container_1.Container.registerNodeType('protocols/misc/serial-connector', SerialConnectorNode);
//# sourceMappingURL=serial-connector.js.map