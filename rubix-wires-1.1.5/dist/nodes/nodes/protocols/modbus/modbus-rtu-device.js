"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_node_1 = require("../../../container-node");
const container_1 = require("../../../container");
const node_1 = require("../../../node");
const constants_1 = require("../../../constants");
const net = require('net');
class ModbusSerialDeviceNode extends container_node_1.ContainerNode {
    constructor(container) {
        super(container);
        this.tcpServer = null;
        this.db = null;
        this.uuid = null;
        this.subscriber = null;
        this.outStatus = 0;
        this.outError = 1;
        this.outMessageJson = 2;
        this.title = 'Modbus 485 Device';
        this.description =
            `## Description\n ` +
                ` This node is used as a modbus TCP or RTU(rs485) modbus device.\n ` +
                ` The node is to be added inside a modbus network node (The network details will be added in the network node)\n ` +
                ` The points for the device will be added inside this node \n ` +
                `   \n ` +
                `### Enable\n ` +
                `   \n ` +
                ` This will enable/disable the device from polling \n ` +
                `   \n ` +
                `### Modbus Address\n ` +
                `   \n ` +
                ` If device is RTU type set the slave modbus address\n ` +
                `   \n ` +
                `### Device Timeout\n ` +
                `   \n ` +
                ` This setting is used for the polling. This is the amount of time the polling will wait before moving onto the next register or device to poll\n ` +
                `   \n ` +
                `### Network Type\n ` +
                `   \n ` +
                `If type is TCP set select type TCP and set the target device IP and port \n ` +
                `If type is RTU set the device address as per setting **Modbus Address** \n ` +
                `   \n ` +
                `## Node outputs\n ` +
                `   \n ` +
                ` If device is TCP when the node is added or after the setting a change a device ping will be sent to see if the device is online\n ` +
                ` If device is online **status** will be sent to true and the **error** will be sent to false. If the device if offline the **status** will be sent to false and the **error** true \n ` +
                `   \n `;
        this.addOutput('status', node_1.Type.BOOLEAN);
        this.addOutput('error', node_1.Type.STRING);
        this.addOutput('message', node_1.Type.JSON);
        this.settings['deviceEnable'] = {
            description: 'Device enable',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['address'] = {
            description: 'Modbus address',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['deviceTimeout'] = {
            description: 'Device Timeout Delay Setting (MS)',
            value: 2000,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['transport'] = {
            description: 'TCP or RTU/RS485',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 'rtu', text: 'Modbus RTU over Serial 485' },
                    { value: 'tcp', text: 'Modbus TCP/IP' },
                ],
            },
            value: 'rtu',
        };
        this.settings['ipAddress'] = {
            description: 'Network IP Address',
            value: '0.0.0.0',
            type: node_1.SettingType.STRING,
        };
        this.settings['ipPort'] = {
            description: 'Network Port Number',
            value: 502,
            type: node_1.SettingType.NUMBER,
        };
        this.setSettingsConfig({
            conditions: {
                ipAddress: setting => {
                    return setting['transport'].value === 'tcp';
                },
                ipPort: setting => {
                    return setting['transport'].value === 'tcp';
                },
            },
        });
    }
    onRemoved() {
        if (this.side !== container_1.Side.server)
            return;
        for (let id in this.sub_container._nodes) {
            let node = this.sub_container._nodes[id];
            node.container.remove(node);
        }
        delete container_1.Container.containers[this.sub_container.id];
    }
    ping() {
        const host = [this.settings['ipAddress'].value, this.settings['ipPort'].value];
        var sock = new net.Socket();
        sock.setTimeout(5000);
        sock
            .on('connect', () => {
            this.setOutputData(this.outStatus, true, true);
            this.setOutputData(this.outError, false, true);
            this.setOutputData(this.outMessageJson, host[0] + ':' + host[1] + ' is up.', true);
            sock.destroy();
        })
            .on('error', e => {
            this.setOutputData(this.outError, true, true);
            this.setOutputData(this.outStatus, false, true);
            this.setOutputData(this.outMessageJson, host[0] + ':' + host[1] + ' is down: ' + e.message, true);
        })
            .on('timeout', e => {
            this.setOutputData(this.outError, true, true);
            this.setOutputData(this.outStatus, false, true);
            this.setOutputData(this.outMessageJson, host[0] + ':' + host[1] + ' is down: timeout', true);
        })
            .connect(host[1], host[0]);
    }
    onAdded() {
        super.onAdded();
        this.name = `id_${this.container.id.toString()}_${this.id.toString()}`;
        this.broadcastNameToClients();
        if (this.side !== container_1.Side.server)
            return;
        this.uuid = this.id;
        if (this.settings['transport'].value === 'tcp') {
            this.ping();
        }
    }
    onAfterSettingsChange() {
        if (this.side !== container_1.Side.server)
            return;
        if (this.settings['transport'].value === 'tcp') {
            this.ping();
        }
    }
    subscribeError(e) {
        this.setOutputData(this.outError, e, true);
    }
}
container_1.Container.registerNodeType(constants_1.MODBUS_RTU_DEVICE, ModbusSerialDeviceNode, constants_1.MODBUS_RTU_NETWORK);
//# sourceMappingURL=modbus-rtu-device.js.map