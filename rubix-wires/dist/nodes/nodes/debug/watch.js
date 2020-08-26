"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class WatchNode extends node_1.Node {
    constructor() {
        super();
        this.dataUpdated = false;
        this.UPDATE_INTERVAL = 300;
        this.title = 'Watch';
        this.description = 'Show value of input';
        this.addInput('input', node_1.Type.ANY);
    }
    onAdded() {
        if (this.side == container_1.Side.server)
            this.startSending();
    }
    startSending() {
        let that = this;
        this.timer = setInterval(function () {
            if (that.dataUpdated) {
                that.dataUpdated = false;
                that.sendMessageToEditorSide({ value: that.lastData });
            }
        }, this.UPDATE_INTERVAL);
    }
    onInputUpdated() {
        this.lastData = this.getInputData(0);
        this.dataUpdated = true;
    }
    onRemoved() {
        if (this.timer)
            clearInterval(this.timer);
    }
    onGetMessageToEditorSide(data) {
        this.lastData = data.value;
        this.showValueOnInput(data.value);
    }
    showValueOnInput(value) {
        this.inputs[0].label = value;
        this.setDirtyCanvas(true, false);
    }
    updateInputsLabels() {
        this.showValueOnInput(this.lastData);
    }
}
exports.WatchNode = WatchNode;
container_1.Container.registerNodeType('debug/watch', WatchNode);
//# sourceMappingURL=watch.js.map