"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
class TriggeredInjectNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Inject';
        this.description =
            "While 'enable' is 'true', ‘output’ will send 'message' value when 'trigger' transitions from 'false' to 'true";
        this.addInputWithSettings('enable', node_io_1.Type.BOOLEAN, true, 'Enable');
        this.addInputWithSettings('message', node_io_1.Type.STRING, 'true', 'Message');
        this.addInput('trigger', node_io_1.Type.BOOLEAN);
        this.addOutput('output', node_io_1.Type.BOOLEAN);
    }
    onCreated() {
        this.lastTrigger = false;
    }
    onAdded() {
        const enable = this.getInputData(0);
        if (!enable) {
            this.setOutputData(0, null);
            return;
        }
    }
    onInputUpdated() {
        const enable = this.getInputData(0);
        if (!enable) {
            this.setOutputData(0, null, true);
            return;
        }
        let trigger = this.getInputData(2);
        if (trigger && !this.lastTrigger) {
            const message = this.getInputData(1);
            this.setOutputData(0, message, false);
        }
        this.lastTrigger = trigger;
    }
    onAfterSettingsChange() { }
}
exports.TriggeredInjectNode = TriggeredInjectNode;
container_1.Container.registerNodeType('trigger/inject', TriggeredInjectNode);
//# sourceMappingURL=inject.js.map