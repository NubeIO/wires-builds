"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_node_1 = require("../../../container-node");
const container_1 = require("../../../container");
const node_1 = require("../../../node");
const constants_1 = require("../../../constants");
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
        this.description = 'This node allows you create a Modbus TCP server';
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
    onAdded() {
        super.onAdded();
        this.name = `id_${this.container.id.toString()}_${this.id.toString()}`;
        this.broadcastNameToClients();
        if (this.side !== container_1.Side.server)
            return;
        this.uuid = this.id;
    }
    subscribeError(e) {
        this.setOutputData(this.outError, e, true);
    }
}
container_1.Container.registerNodeType(constants_1.MODBUS_RTU_DEVICE, ModbusSerialDeviceNode, constants_1.MODBUS_RTU_NETWORK);
//# sourceMappingURL=modbus-rtu-device.js.map