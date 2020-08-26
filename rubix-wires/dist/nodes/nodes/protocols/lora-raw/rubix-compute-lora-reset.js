"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../../node");
const container_1 = require("../../../container");
const time_utils_1 = require("../../../utils/time-utils");
const Gpio = require('pigpio').Gpio;
const os_utils_1 = require("../../../utils/os-utils");
const node_colour_change_1 = require("../../../utils/nodes/node-colour-change");
class RubixComputeLORAResetNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Rubix Compute LORA Xbee Reset';
        this.description =
            `## Description\n ` +
                ` The is node is used in conjunction with the ***Rubix Compute***  when using the ***LORA Xbee***. This node uses an internal gpio-api to rest a ***LORA Xbee***\n ` +
                `   \n ` +
                `## Description\n ` +
                `   \n ` +
                ` The reason for this nodes is to give the user more control over the nube hardware\n ` +
                ` When a ***trigger*** is activated on the node input or the ***interval*** timer is triggered the lora-modules will be reset\n ` +
                ` The reboot of the module only takes ***1000ms*** to restart\n ` +
                this.addInputWithSettings('enableInterval', node_1.Type.BOOLEAN, false, 'Enable Interval Reset');
        this.addInputWithSettings('interval', node_1.Type.NUMBER, 15, 'Interval');
        this.addInput('trigger', node_1.Type.BOOLEAN);
        this.addOutput('lastReset');
        this.addOutput('status');
        this.addOutput('error');
        this.settings['time'] = {
            description: 'Units',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 'milliseconds', text: 'Milliseconds' },
                    { value: 'seconds', text: 'Seconds' },
                    { value: 'minutes', text: 'Minutes' },
                    { value: 'hours', text: 'Hours' },
                ],
            },
            value: 'minutes',
        };
        this.setSettingsConfig({
            groups: [{ interval: { weight: 2 }, time: {} }],
        });
    }
    onAdded() {
        this.inputs[1]['name'] = `[interval] (${this.settings['time'].value})`;
        if (this.side !== container_1.Side.server)
            return;
        let interval = this.getInputData(1);
        interval = time_utils_1.default.timeConvert(interval, this.settings['time'].value);
        this.EXECUTE_INTERVAL = interval;
    }
    onExecute() {
        if (this.side !== container_1.Side.server)
            return;
        if (!this.getInputData(0))
            return;
        this.resetLORA();
    }
    onInputUpdated() {
        if (this.side !== container_1.Side.server)
            return;
        let interval = this.getInputData(1);
        interval = time_utils_1.default.timeConvert(interval, this.settings['time'].value);
        this.EXECUTE_INTERVAL = interval;
        let trigger = this.getInputData(2);
        if (trigger && !this.lastTrigger)
            this.resetLORA();
        this.lastTrigger = trigger;
    }
    resetLORA() {
        if (this.side !== container_1.Side.server)
            return;
        os_utils_1.default.systemInfo()
            .then(e => {
            if (e.system.model === 'BCM2835') {
                const mcu_reset = new Gpio(12, { mode: Gpio.OUTPUT });
                mcu_reset.digitalWrite(0);
                setTimeout(function () { mcu_reset.digitalWrite(1); }, 2000);
                this.setOutputData(0, new Date().valueOf(), true);
                this.setOutputData(1, true);
                this.setOutputData(2, 'reset sent');
                node_colour_change_1.default.nodeColourChange(this, node_1.NodeState.NORMAL);
            }
            else {
                this.setOutputData(1, null);
                this.setOutputData(2, `incorrect device type ${e.system.model}`);
                node_colour_change_1.default.nodeColourChange(this, node_1.NodeState.ERROR);
            }
        }).catch(err => this.setOutputData(2, `ERROR ${err}`));
    }
    onAfterSettingsChange() {
        this.inputs[1]['name'] = `[interval] (${this.settings['time'].value})`;
        if (this.side !== container_1.Side.server)
            return;
        this.onInputUpdated();
    }
}
exports.RubixComputeLORAResetNode = RubixComputeLORAResetNode;
container_1.Container.registerNodeType('protocols/lora-raw/rubix-lora-reset', RubixComputeLORAResetNode);
//# sourceMappingURL=rubix-compute-lora-reset.js.map