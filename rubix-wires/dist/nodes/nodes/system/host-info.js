"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const os_utils_1 = require("../../utils/os-utils");
class HostInfo extends node_1.Node {
    constructor() {
        super();
        this.title = 'Host Info';
        this.description =
            `## Description\n ` +
                ` This node outputs various linux system information\n ` +
                ` More Info:  https://docs.nube-iiot.com/en/nodes/home#host-info\n ` +
                `   \n ` +
                `## On change of settings\n ` +
                `   \n ` +
                ` On change of settings output ***system-info*** will return data in json format\n ` +
                `## On active Input\n ` +
                `   \n ` +
                ` On an active input ***trigger*** the outputs ***cpu-temp***, ***disc-usage***, ***system-time***, ***system-memory*** will return data in json format\n ` +
                `## The data returned\n ` +
                `   \n ` +
                ` On change of settings output ***system-info*** will return data in json format\n ` +
                `   \n `;
        this.addInput('trigger', node_1.Type.BOOLEAN);
        this.addOutput('system-info', node_1.Type.JSON);
        this.addOutput('cpu-temp', node_1.Type.JSON);
        this.addOutput('disc-usage', node_1.Type.JSON);
        this.addOutput('system-time', node_1.Type.JSON);
        this.addOutput('system-memory', node_1.Type.JSON);
        this.addOutput('error', node_1.Type.STRING);
    }
    onCreated() {
        this.onAfterSettingsChange();
    }
    callSystemInfo() {
        os_utils_1.default.systemInfo()
            .then(e => this.setOutputData(0, e))
            .catch(err => this.setOutputData(5, err));
    }
    callInfo() {
        os_utils_1.default.cpuTemperature()
            .then(e => this.setOutputData(1, e))
            .catch(err => this.setOutputData(5, err));
        os_utils_1.default.fsSize()
            .then(e => this.setOutputData(2, e))
            .catch(err => this.setOutputData(5, err));
        os_utils_1.default.systemTime()
            .then(e => this.setOutputData(3, e))
            .catch(err => this.setOutputData(5, err));
        os_utils_1.default.systemMem()
            .then(e => this.setOutputData(4, e))
            .catch(err => this.setOutputData(5, err));
    }
    onAfterSettingsChange() {
        if (this.side !== container_1.Side.server)
            return;
        this.callSystemInfo();
    }
    onInputUpdated() {
        if (this.side !== container_1.Side.server)
            return;
        this.callInfo();
    }
}
container_1.Container.registerNodeType('system/host-info', HostInfo);
//# sourceMappingURL=host-info.js.map