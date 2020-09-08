"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
class SetResetNode extends node_1.Node {
    constructor() {
        super();
        this.out = null;
        this.title = 'Set Reset';
        this.description =
            "'output' will change to 'true' when 'set' is 'true', and 'reset' is 'false'.  There are 2 cases when 'output' will change to 'false': 1) 'reset' is 'true', and 'set is 'false'.  2) If the 'Reset when set=true' setting is turned ON (Default), and 'reset' and 'set' are both 'true' .  If this setting is turned OFF, 'output' will only change to 'false' under Case 1) conditions. ";
        this.addInput('set', node_io_1.Type.BOOLEAN);
        this.addInput('reset', node_io_1.Type.BOOLEAN);
        this.addOutput('output', node_io_1.Type.BOOLEAN);
        this.settings['lock'] = {
            description: 'Reset when set=true',
            value: true,
            type: node_1.SettingType.BOOLEAN,
        };
    }
    onAdded() {
        this.setOutputData(0, false, true);
        this.onInputUpdated();
    }
    onInputUpdated() {
        let set = this.inputs[0].data;
        let reset = this.inputs[1].data;
        let lock = this.settings['lock'].value;
        let out = this.out;
        if (set && !reset) {
            this.setOutputData(0, true, true);
            this.out = true;
        }
        else if (lock && reset && out && set) {
            this.setOutputData(0, false, true);
            this.out = false;
        }
        else if (!set && out && reset) {
            this.setOutputData(0, false, true);
            this.out = false;
        }
    }
}
container_1.Container.registerNodeType('latch/set-reset', SetResetNode);
//# sourceMappingURL=set-reset.js.map