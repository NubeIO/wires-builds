"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const find = require('local-devices');
class NetworkScan extends node_1.Node {
    constructor() {
        super();
        this.title = 'Network Scan';
        this.description = 'A node for doing an IP and MAC network scan. Returns JSON output';
        this.addInput('trigger');
        this.addOutput('out');
        this.addOutput('error', node_1.Type.STRING);
    }
    onInputUpdated() {
        if (this.side !== container_1.Side.server)
            return;
        try {
            find()
                .then(devices => {
                this.setOutputData(0, devices);
            })
                .catch(e => {
                this.setOutputData(1, e);
            });
        }
        catch (e) {
            this.setOutputData(1, e);
        }
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('network/network-scan', NetworkScan);
//# sourceMappingURL=network-scan.js.map