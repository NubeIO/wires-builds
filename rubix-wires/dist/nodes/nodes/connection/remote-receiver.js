"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const flexible_node_1 = require("../../flexible-node");
class ConnectionRemoteReceiverNode extends flexible_node_1.FlexibleNode {
    constructor() {
        super();
        this.dynamicInputsExist = false;
        this.dynamicSettingsExist = false;
        this.dynamicOutputsExist = true;
        this.dynamicDefaultOutputs = 1;
        this.dynamicMinOutputs = 1;
        this.title = 'Remote Link Receiver Node';
        this.description =
            'This node works in conjunction with Remote Link Transmitter, ' +
                'and provides a remote connection of nodes. ' +
                'Read the description to Remote Transmitter to understand how it works.';
        this.settings['channel'] = {
            description: 'Set The Channel Number',
            value: 1,
            type: node_1.SettingType.NUMBER,
        };
    }
    onAdded() {
        this.updateTitle();
    }
    onEditorApiPostRequest(req, res) {
        if (req.body.channel != this.settings['channel'].value)
            return;
        if (!this.outputs[req.body.output]) {
            let mess = 'Received value, but output [' + (+req.body.output + 1) + '] not exist.';
            res.status(400).send(mess);
            return this.debugWarn(mess);
        }
        this.setOutputData(req.body.output, req.body.value);
        if (!res.headersSent)
            res.send('ok');
    }
    onAfterSettingsChange() {
        super.onAfterSettingsChange();
        this.updateTitle();
    }
    updateTitle() {
        this.title = 'Remote Link Receiver [' + this.settings['channel'].value + ']';
    }
}
exports.ConnectionRemoteReceiverNode = ConnectionRemoteReceiverNode;
container_1.Container.registerNodeType('connection/remote-link-receiver', ConnectionRemoteReceiverNode);
//# sourceMappingURL=remote-receiver.js.map