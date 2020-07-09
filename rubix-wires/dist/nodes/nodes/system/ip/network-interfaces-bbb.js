"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../../node");
const container_1 = require("../../../container");
const utils_1 = require("../../../utils");
const ip_address_utils_1 = require("../../../utils/ip-address-utils");
const child_process_1 = require("child_process");
const ip = require('ip');
class UpdateIPEdge28 extends node_1.Node {
    constructor() {
        super();
        this.timeStamp = utils_1.default.getTimeStamp();
        this.interfaceEth0 = 'eth0';
        this.eth0Ip = 0;
        this.messageOutput = 2;
        this.errorOutput = 3;
        this.msgOut = (num, msg) => {
            this.setOutputData(num, msg);
        };
        this.title = 'Network Interface EdgeIO-28';
        this.description =
            'This node is used to configure the network (IP) interface for edge28 controllers.  Changes made to settings will only be saved if ‘Save changes on save’ is toggled ON.  In some cases a reboot will be required to save the changes, if ‘Reboot’ is toggled ON, then clicking ‘save’ will reboot the controller.        NOTE: Making changes on a remote device could cause the device to become inaccessible.';
        this.addInput('get interface address', node_1.Type.BOOLEAN);
        this.addInput('enable eth0 ', node_1.Type.BOOLEAN);
        this.addOutput('ip eth0', node_1.Type.STRING);
        this.addOutput('message', node_1.Type.STRING);
        this.addOutput('error', node_1.Type.STRING);
        this.settings['writeChanges'] = {
            description: 'Save changes on save',
            type: node_1.SettingType.BOOLEAN,
            value: false,
        };
        this.settings['reboot'] = {
            description: 'Reboot. Warning this will reboot the device',
            type: node_1.SettingType.BOOLEAN,
            value: false,
        };
        this.settings['eth0_group'] = {
            description: 'Eth Port 0',
            value: '',
            type: node_1.SettingType.GROUP,
        };
        this.settings['interfaceTypeEth0'] = {
            description: 'Interface Type eth0',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 0, text: 'DHCP' },
                    { value: 1, text: 'Static' },
                ],
            },
            value: 0,
        };
        this.settings['newIpEth0'] = {
            description: 'IP',
            value: '192.168.0.40',
            type: node_1.SettingType.STRING,
        };
        this.settings['netNetmaskEth0'] = {
            description: 'Netmask eth0',
            value: '255.255.255.0',
            type: node_1.SettingType.STRING,
        };
        this.settings['newGatewayEth0'] = {
            description: 'Gateway',
            value: '192.168.0.1',
            type: node_1.SettingType.STRING,
        };
        this.settings['newNameServerEth0'] = {
            description: 'Name Servers eth0',
            value: '8.8.8.8',
            type: node_1.SettingType.STRING,
        };
        this.setSettingsConfig({
            groups: [
                { newIpEth0: {}, netNetmaskEth0: {} },
                { newGatewayEth0: {}, newNameServerEth0: {} },
            ],
            conditions: {
                newIpEth0: setting => {
                    const val = setting['interfaceTypeEth0'].value;
                    return ![0].includes(val);
                },
                netNetmaskEth0: setting => {
                    const val = setting['interfaceTypeEth0'].value;
                    return ![0].includes(val);
                },
                newGatewayEth0: setting => {
                    const val = setting['interfaceTypeEth0'].value;
                    return ![0].includes(val);
                },
                newNameServerEth0: setting => {
                    const val = setting['interfaceTypeEth0'].value;
                    return ![0].includes(val);
                },
            },
        });
    }
    onAdded() {
        setTimeout(() => {
            this.getInterfaces();
        }, 2000);
    }
    onInputUpdated() {
        let enableInterfaceEth0 = this.getInputData(1);
        if (this.inputs[0].updated) {
            this.msgOut(this.messageOutput, 'called getInterfaces' + ' ' + this.timeStamp);
            setTimeout(() => {
                this.getInterfaces();
            }, 2000);
        }
        if (this.inputs[1].updated) {
            if (enableInterfaceEth0 === true) {
                this.msgOut(this.messageOutput, 'called enable Eth0 true' + ' ' + this.timeStamp);
                this.enableNetwork(this.interfaceEth0);
            }
            else if (enableInterfaceEth0 === false) {
                this.msgOut(this.messageOutput, 'called disable Eth0 false' + ' ' + this.timeStamp);
                this.disableNetwork(this.interfaceEth0);
            }
        }
    }
    onAfterSettingsChange() {
        if (this.side !== container_1.Side.server)
            return;
        const newIpEth0 = this.settings['newIpEth0'].value;
        const netNetmaskEth0 = this.settings['netNetmaskEth0'].value;
        const newGatewayEth0 = this.settings['newGatewayEth0'].value;
        const newNameServerEth0 = this.settings['newNameServerEth0'].value;
        const interfaceTypeEth0 = this.settings['interfaceTypeEth0'].value;
        const writeChanges = this.settings['writeChanges'].value;
        const reboot = this.settings['reboot'].value;
        const checkIpSettingsEth0 = ip_address_utils_1.default.checkIpValid(newIpEth0, netNetmaskEth0, newGatewayEth0, newNameServerEth0);
        if (reboot) {
            this.msgOut(this.messageOutput, 'called sudo reboot will reboot in 10 sec' + ' ' + this.timeStamp);
            this.settings['reboot'].value = false;
            this.broadcastSettingsToClients();
            setTimeout(() => {
                this.execCommand(`sudo reboot`);
            }, 10000);
        }
        if (checkIpSettingsEth0 && writeChanges) {
            let interfacesArray = [];
            if (interfaceTypeEth0 == 0) {
                this.title = 'Adapter' + +' ' + '(DHCP)';
                let eth0 = {
                    interface: this.interfaceEth0,
                    dhcp: true,
                };
                interfacesArray.push(eth0);
            }
            if (interfaceTypeEth0 == 1) {
                this.title = 'Adapter' + ' ' + '(Static)';
                let subnetMaskLength = ip.subnet(newIpEth0, netNetmaskEth0);
                let eth0 = {
                    interface: this.interfaceEth0,
                    ip_address: newIpEth0,
                    prefix: subnetMaskLength.subnetMaskLength,
                    gateway: newGatewayEth0,
                    nameserver: [newNameServerEth0],
                };
                interfacesArray.push(eth0);
            }
        }
        else
            this.msgOut(this.messageOutput, 'invalid ip settings');
        if (!writeChanges) {
            this.msgOut(this.messageOutput, 'nothing saved' + ' ' + this.timeStamp);
            this.msgOut(this.errorOutput, true);
        }
    }
    execCommand(command) {
        if (this.side !== container_1.Side.server)
            return;
        try {
            child_process_1.exec(command, (err, stdout, stderr) => {
                this.msgOut(this.messageOutput, 'called command' + ' ' + command + ' ' + this.timeStamp);
                if (stdout) {
                    this.msgOut(this.messageOutput, stdout + ' ' + this.timeStamp);
                    this.msgOut(this.errorOutput, false);
                }
                if (err) {
                    this.msgOut(this.messageOutput, err + ' ' + this.timeStamp);
                    this.msgOut(this.errorOutput, true);
                }
                if (stderr) {
                    this.msgOut(this.messageOutput, stderr + ' ' + this.timeStamp);
                    this.msgOut(this.errorOutput, true);
                }
            });
        }
        catch (e) {
            this.msgOut(this.messageOutput, e + ' ' + this.timeStamp);
            this.msgOut(this.errorOutput, true);
        }
    }
    getInterfaces() {
        ip_address_utils_1.default.getActiveNetworks()
            .then(list => {
            const getInterfaceEth0 = list.filter(e => {
                return e.name == this.interfaceEth0;
            });
            this.msgOut(this.eth0Ip, getInterfaceEth0[0].ip_address);
            this.msgOut(this.errorOutput, false);
        })
            .catch(err => {
            this.msgOut(this.messageOutput, err);
            this.msgOut(this.errorOutput, true);
        });
    }
    enableNetwork(iface) {
        try {
            ip_address_utils_1.default.networkUpDown(iface, 'up')
                .then(r => {
                console.log(r);
                setTimeout(() => {
                    this.getInterfaces();
                }, 5000);
            })
                .catch(e => console.log(e));
        }
        catch (err) {
            console.log(err);
        }
    }
    disableNetwork(iface) {
        try {
            ip_address_utils_1.default.networkUpDown(iface, 'down')
                .then(r => {
                console.log(r);
            })
                .catch(err => console.log(err));
        }
        catch (err) {
            console.log(err);
        }
    }
}
container_1.Container.registerNodeType('system/network-interface-edge-28', UpdateIPEdge28);
//# sourceMappingURL=network-interfaces-bbb.js.map