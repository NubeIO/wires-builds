"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const child_process_1 = require("child_process");
const node_io_1 = require("../../node-io");
const helper_1 = require("../../../utils/helper");
class SystemExecuteNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Execute Command';
        this.description =
            'This node triggers commands to be run on the linux host.  The string input ‘command input’ will be run when ‘trigger’ transitions from ‘false’ to ‘true’.      NOTE: ONLY USE THIS NODE IF YOU KNOW EXACTLY WHAT YOU ARE DOING. SYSTEM COMMANDS CAN CHANGE SYSTEM CONFIGURATION WHICH CANNOT BE FIXED FROM WITHIN WIRES.  YOU COULD BREAK WIRES, THE CONTROLLER, OR YOUR PC. ';
        this.addInputWithSettings('command', node_io_1.Type.STRING, 'pwd', 'Linux Command', false);
        this.addInput('trigger', node_io_1.Type.BOOLEAN);
        this.addOutput('out stdout', node_io_1.Type.STRING);
        this.addOutput('out err', node_io_1.Type.STRING);
        this.addOutput('out stderr', node_io_1.Type.STRING);
        this.addOutput('error', node_io_1.Type.STRING);
    }
    onCreated() {
        this.lastTrigger = false;
    }
    onInputUpdated() {
        const trigger = this.getInputData(1) || false;
        if (this.inputs[1].updated && trigger && !this.lastTrigger) {
            const command = this.getInputData(0);
            if (helper_1.isNull(command))
                return;
            try {
                child_process_1.exec(command, (err, stdout, stderr) => {
                    if (stdout) {
                        this.setOutputData(0, stdout);
                        this.setOutputData(3, false);
                    }
                    if (err) {
                        this.setOutputData(1, err);
                        this.setOutputData(3, true);
                    }
                    if (stderr) {
                        this.setOutputData(2, stderr);
                        this.setOutputData(3, true);
                    }
                });
            }
            catch (e) {
                this.setOutputData(3, true);
            }
        }
        this.lastTrigger = trigger;
    }
}
container_1.Container.registerNodeType('system/execute-cmd', SystemExecuteNode);
//# sourceMappingURL=execute-cmd.js.map