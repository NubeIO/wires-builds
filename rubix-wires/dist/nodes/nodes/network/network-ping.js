"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const ping = require("ping");
const node_io_1 = require("../../node-io");
class DevicePing extends node_1.Node {
    constructor() {
        super();
        this.title = 'Network Ping';
        this.description =
            "Ping's an IP on the network, Example inputs '192.168.1.1', 'google.com', 'aidan-android'";
        this.addInput('in1 hosts', node_io_1.Type.STRING);
        this.addOutput('out', node_io_1.Type.STRING);
        this.addOutput('error', node_io_1.Type.STRING);
    }
    onInputUpdated() {
        if (this.side !== container_1.Side.server)
            return;
        if (this.getInputData(0) == null)
            return;
        let hosts = this.getInputData(0);
        var properties = hosts.toString().split(',');
        var obj = {};
        properties.forEach(function (property) {
            var tup = property.toString().split(':');
            obj[tup[0]] = tup[0];
        });
        let list = Object.keys(obj);
        try {
            list.forEach((host, index) => {
                ping.sys.probe(host, isAlive => {
                    let out = {
                        status: isAlive,
                        host: host,
                    };
                    setTimeout(() => {
                        this.setOutputData(0, out);
                        this.setOutputData(1, false);
                    }, index * 1000);
                });
            });
        }
        catch (e) {
            this.setOutputData(1, true);
        }
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('network/network-ping', DevicePing);
//# sourceMappingURL=network-ping.js.map