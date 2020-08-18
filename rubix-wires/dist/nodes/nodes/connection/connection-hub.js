"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const flexible_node_1 = require("../../flexible-node");
let hubDesc = 'This node sends a value from any of its inputs to all its outputs. <br/>' +
    'The usage of this node can be very wide. Lets consider a few examples. <br/><br/>' +
    'Connecting many-to-one. <br/>' +
    'For example, you want to connect several different nodes to ' +
    'the input of one node. By default, this is impossible, ' +
    'because one input can only have one connection. ' +
    'But you can work around this limitation by using a hub. ' +
    'Connect multiple devices to the hub, then connect ' +
    'the hub to the input of the node.<br/><br/>' +
    'Connecting one-to-many.  <br/>' +
    'If you connect multiple nodes to one output of a node, ' +
    'node will send the value to all nodes that are connected, ' +
    "but you can't control the order in which it will do it. " +
    'But you can work around this limitation by using a hub. ' +
    'Connect the output of the node to the hub and then ' +
    "connect the other nodes to the hub's outputs " +
    'in the order in which they should receive the value. ' +
    'The hub sends a value on the outputs starting with the first output. <br/><br/>' +
    'Connecting many-to-many.  <br/>' +
    'Create many inputs and outputs in the hub to link several nodes. ' +
    'All devices on the outputs of the hub ' +
    'will receive a message from any node in the input.';
class HubNode extends flexible_node_1.FlexibleNode {
    constructor() {
        super();
        this.title = 'Hub';
        this.description = hubDesc;
        this.dynamicInputsType = node_1.Type.ANY;
        this.dynamicOutputsType = node_1.Type.ANY;
        this.dynamicSettingsExist = false;
        this.dynamicOutputsExist = true;
        this.dynamicDefaultInputs = 1;
        this.dynamicDefaultOutputs = 1;
        this.dynamicMinInputs = 1;
        this.dynamicMinOutputs = 1;
        this.dynamicMaxInputs = 100;
        this.dynamicMaxOutputs = 100;
    }
    onAdded() {
        this.onInputUpdated();
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
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('connection/hub', HubNode);
//# sourceMappingURL=connection-hub.js.map