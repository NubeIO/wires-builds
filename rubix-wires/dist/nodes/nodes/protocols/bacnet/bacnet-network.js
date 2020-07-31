"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bacnet = require("node-bacnet");
const node_1 = require("../../../node");
const container_1 = require("../../../container");
const container_node_1 = require("../../../container-node");
const bacnet_constant_1 = require("./bacnet-constant");
const bacnet_utils_1 = require("./bacnet-utils");
const constants_1 = require("../../../constants");
class BACnetNetwork extends container_node_1.ContainerNode {
    constructor(ContainerNode) {
        super(ContainerNode);
        this.bacnetClient = null;
        this.inputWhoIs = 0;
        this.deviceNodes = [];
        this.outputOut = 0;
        this.outputMsg = 1;
        this.outputError = 2;
        this.title = 'BACnet Network';
        this.description =
            'This node acts as a container for bacnet-device nodes. All bacnet-device nodes should be added within the bacnet-network container.  IP configuration for the BACnet network connection are set from settings.  The bacnet-network node can also be used to perform a BACnet Discover (WhoIs).';
        this.addInput('discover', node_1.Type.BOOLEAN);
        this.addOutput('out', node_1.Type.STRING);
        this.addOutput('out msg', node_1.Type.STRING);
        this.addOutput('error', node_1.Type.BOOLEAN);
        this.settings['networkEnable'] = {
            description: 'Network enable',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['interface'] = {
            description: 'interface',
            value: '0.0.0.0',
            type: node_1.SettingType.STRING,
        };
        this.settings['port'] = {
            description: 'port',
            value: 47808,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['broadcastAddress'] = {
            description: 'broadcastAddress',
            value: '255.255.255.255',
            type: node_1.SettingType.STRING,
        };
        this.settings['apduTimeout'] = {
            description: 'BACnet apduTimeout',
            value: 6000,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['networkNumber'] = {
            description: 'BACnet network Number (Set to -1 to disable)',
            value: -1,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['networkNumberWhoIs'] = {
            description: 'BACnet Network Number for Discover',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 0, text: 'This network number' },
                    { value: 1, text: 'Global (0xFFFF)' },
                    { value: 2, text: 'Blank' },
                ],
            },
            value: 0,
        };
        this.settings['devicePolling'] = {
            description: 'Polling time setting in ms',
            value: 2000,
            type: node_1.SettingType.NUMBER,
        };
    }
    onAdded() {
        super.onAdded();
        this.name = `BACnet Network:  cid_${this.container.id.toString()}_sid_${this.sub_container.id.toString()}_id${this.id.toString()}`;
        this.initializeBacnetClient();
    }
    onAfterSettingsChange(oldSettings) {
        super.onAfterSettingsChange(oldSettings);
        if (this.side !== container_1.Side.server)
            return;
        this.initializeBacnetClient();
    }
    onInputUpdated() {
        this.iAm();
        this.whoIs();
    }
    whoIs() {
        if (this.side !== container_1.Side.server)
            return;
        const iface = this.settings['interface'].value;
        const networkNumber = this.settings['networkNumber'].value;
        const networkNumberWhoIs = this.settings['networkNumberWhoIs'].value;
        if (this.bacnetClient) {
            if (networkNumberWhoIs === 0) {
                this.bacnetClient.whoIs({ net: networkNumber, interface: iface });
                this.setOutputData(this.outputMsg, `INFO: Send a WhoIs on net: ${networkNumber} interface: ${iface}`);
            }
            else if (networkNumberWhoIs === 1) {
                this.bacnetClient.whoIs({ net: 0xffff, interface: iface });
                this.setOutputData(this.outputMsg, `INFO: Send a WhoIs on net: ${0xffff} interface: ${iface}`);
            }
            else if (networkNumberWhoIs === 2) {
                this.bacnetClient.whoIs({ interface: iface });
                this.setOutputData(this.outputMsg, `INFO: Send a WhoIs on net: BLANK interface: ${iface}`);
            }
        }
        else
            this.setOutputData(this.outputMsg, `ERROR: Failed to send whoIs`);
    }
    iAm() {
        if (this.side !== container_1.Side.server)
            return;
        this.setOutputData(this.outputMsg, `INFO: On iAm replay`);
        this.bacnetClient.on('iAm', device => {
            this.setOutputData(this.outputMsg, `INFO: On iAm replay from device: ${device.payload.deviceId}`);
        });
    }
    subscribe({ action, payload }) {
        switch (action) {
            case bacnet_constant_1.ADD_DEVICE:
                this.deviceNodes.push(payload);
                break;
            case bacnet_constant_1.REMOVE_DEVICE:
                this.deviceNodes = this.deviceNodes.filter(pointNode => pointNode.id !== payload.id);
                break;
            case bacnet_constant_1.GET_BACNET_CLIENT:
                return this.bacnetClient;
            case bacnet_constant_1.GET_NETWORK_SETTINGS:
                return this.settings;
            default:
                this.debugWarn("Request action doesn't match");
        }
    }
    onRemoved() {
        super.onRemoved();
        this.closeBacnetClient();
    }
    closeBacnetClient() {
        if (this.bacnetClient) {
            this.setOutputData(this.outputMsg, `INFO: Closing BACnet client...`);
            this.bacnetClient.close();
        }
    }
    initializeBacnetClient() {
        if (this.side !== container_1.Side.server)
            return;
        this.closeBacnetClient();
        this.setOutputData(this.outputMsg, `INFO: Initializing BACnet...`);
        this.bacnetClient = new Bacnet({
            apduTimeout: this.settings['apduTimeout'].value,
            interface: this.settings['interface'].value,
            port: this.settings['port'].value,
            broadcastAddress: this.settings['broadcastAddress'].value,
        });
        if (this.bacnetClient) {
            this.setOutputData(this.outputMsg, `INFO: Started BACnet Stack :)`);
        }
        else
            this.setOutputData(this.outputMsg, `ERROR: Failed to started BACnet Stack :(`);
        for (let deviceNode of this.deviceNodes) {
            bacnet_utils_1.default.sendPayloadToChild(deviceNode, {
                bacnetClient: this.bacnetClient,
                networkSettings: this.settings,
            });
        }
    }
    emitResult(id, out) {
        this.setOutputData(id, out);
    }
}
exports.BACnetNetwork = BACnetNetwork;
container_1.Container.registerNodeType(constants_1.BACNET_NETWORK, BACnetNetwork);
//# sourceMappingURL=bacnet-network.js.map