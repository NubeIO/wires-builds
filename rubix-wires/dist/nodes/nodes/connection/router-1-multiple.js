"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const utils_1 = require("../../utils");
const flexible_node_1 = require("../../flexible-node");
let hubDesc = "This node sends a value from any of its inputs to all its outputs. <br/>" +
    "The usage of this node can be very wide. Lets consider a few examples. <br/><br/>" +
    "Connecting many-to-one. <br/>" +
    "For example, you want to connect several different nodes to " +
    "the input of one node. By default, this is impossible, " +
    "because one input can only have one connection. " +
    "But you can work around this limitation by using a hub. " +
    "Connect multiple devices to the hub, then connect " +
    "the hub to the input of the node.<br/><br/>" +
    "Connecting one-to-many.  <br/>" +
    "If you connect multiple nodes to one output of a node, " +
    "node will send the value to all nodes that are connected, " +
    "but you can't control the order in which it will do it. " +
    "But you can work around this limitation by using a hub. " +
    "Connect the output of the node to the hub and then " +
    "connect the other nodes to the hub's outputs " +
    "in the order in which they should receive the value. " +
    "The hub sends a value on the outputs starting with the first output. <br/><br/>" +
    "Connecting many-to-many.  <br/>" +
    "Create many inputs and outputs in the hub to link several nodes. " +
    "All devices on the outputs of the hub " +
    "will receive a message from any node in the input.";
class HubNode extends flexible_node_1.FlexibleNode {
    constructor() {
        super();
        this.title = "Hub";
        this.description = hubDesc;
        this.dynamicInputsType = node_1.Type.ANY;
        this.dynamicOutputsType = node_1.Type.ANY;
        this.settings['inputs'] = {
            description: 'inputs count',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
        this.settings['outputs'] = {
            description: 'outputs count',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
    }
    onInputUpdated() {
        let val;
        for (let i in this.inputs)
            if (this.inputs[i].updated)
                val = this.inputs[i].data;
        for (let i in this.outputs)
            this.setOutputData(+i, val);
    }
    onAfterSettingsChange() {
        super.onAfterSettingsChange();
        let inputs = this.settings["inputs"].value;
        let outputs = this.settings["outputs"].value;
        inputs = utils_1.default.clamp(inputs, 1, 1000);
        outputs = utils_1.default.clamp(outputs, 1, 1000);
        this.changeInputsCount(inputs);
        this.changeOutputsCount(outputs);
    }
}
container_1.Container.registerNodeType("connection/hub", HubNode);
class RouterOneToMultipleNode extends node_1.Node {
    constructor() {
        super();
        this.title = "Router 1-multiple";
        this.description = "This node can be used to link one node with several nodes. <br/>" +
            "You can change which node will receive messages (using input \"Active Output\"). " +
            "The other nodes will not receive anything. <br/>" +
            "You can specify the number of outputs in the node settings.<br>" +
            "Note that the outputs numbering is from zero (\"active output\" == 0 will correspond to \"output 0\")";
        this.addInput("active output", node_1.Type.NUMBER);
        this.addInput("value");
        this.addOutput('output', node_1.Type.ANY);
        this.settings['outputs'] = {
            description: 'Outputs count',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
    }
    onInputUpdated() {
        let active = this.getInputData(0);
        let val = this.getInputData(1);
        if (active < 0 || active >= this.getOutputsCount()) {
            this.debugWarn("Defined active output does not exist");
            return;
        }
        this.setOutputData(active, val);
    }
    onAfterSettingsChange() {
        let outputs = this.settings["outputs"].value;
        outputs = utils_1.default.clamp(outputs, 1, 1000);
        this.changeOutputsCount(outputs);
        for (let i = 0; i < outputs; i++)
            this.outputs[i].name = "output " + i;
        if (this.container.db)
            this.container.db.updateNode(this.id, this.container.id, {
                $set: { outputs: this.outputs }
            });
    }
}
container_1.Container.registerNodeType('connection/router-1-many', RouterOneToMultipleNode);
class RouterMultipleToOneNode extends node_1.Node {
    constructor() {
        super();
        this.title = "Router multiple-1";
        this.description = "This node can be used to link several nodes with one node. <br/>" +
            "You can change which node will send messages (using input \"Active Input\"). " +
            "The rest nodes will be blocked. <br/>" +
            "In the settings you can specify the number of inputs.<br>" +
            "Note that the inputs numbering is from zero (\"active input\" == 0 will correspond to \"input 0\")";
        this.addInput("active input", node_1.Type.NUMBER);
        this.addInput("input 0");
        this.addOutput('value', node_1.Type.ANY);
        this.settings['inputs'] = {
            description: 'inputs count',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
    }
    onInputUpdated() {
        let active = this.getInputData(0);
        if (active < 0 || active >= this.getInputsCount() - 1) {
            this.debugWarn("Defined active input does not exist");
            return;
        }
        let val = this.getInputData(active + 1);
        this.setOutputData(0, val);
    }
    onAfterSettingsChange() {
        let inputs = this.settings["inputs"].value;
        inputs = utils_1.default.clamp(inputs, 1, 1000);
        this.changeInputsCount(inputs + 1);
        for (let i = 1; i <= inputs; i++)
            this.inputs[i].name = "input " + (i - 1);
        if (this.container.db)
            this.container.db.updateNode(this.id, this.container.id, {
                $set: { inputs: this.inputs }
            });
    }
}
container_1.Container.registerNodeType("connection/router-multiple-1", RouterMultipleToOneNode);
//# sourceMappingURL=router-1-multiple.js.map