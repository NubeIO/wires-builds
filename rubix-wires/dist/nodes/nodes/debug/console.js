"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const log = require('logplease').create('node', { color: 5 });
class ConsoleNode extends node_1.Node {
    constructor() {
        super();
        this.MAX_MESS_PER_SEC = 11;
        this.messagesPerSec = 0;
        this.title = 'Console';
        this.description = 'Show value inside the console';
        this.addInput('input');
    }
    onAdded() {
        if (this.side == container_1.Side.server)
            this.updateMessPerSec();
    }
    updateMessPerSec() {
        let that = this;
        setInterval(function () {
            if (that.messagesPerSec > that.MAX_MESS_PER_SEC) {
                let dropped = that.messagesPerSec - that.MAX_MESS_PER_SEC;
                log.info('CONSOLE NODE [' +
                    that.container.id +
                    '/' +
                    that.id +
                    ']: dropped ' +
                    dropped +
                    ' messages (data rate limitation)');
                that.sendMessageToEditorSide({ dropped: dropped });
            }
            that.messagesPerSec = 0;
        }, 1000);
    }
    onInputUpdated() {
        if (!this.inputs[0].link)
            return;
        let val = this.getInputData(0);
        this.isRecentlyActive = true;
        this.messagesPerSec++;
        if (this.messagesPerSec <= this.MAX_MESS_PER_SEC) {
            log.info('CONSOLE NODE [' + this.container.id + '/' + this.id + ']: ' + val);
            this.sendMessageToEditorSide({ value: val });
        }
    }
    onGetMessageToEditorSide(data) {
        super.onGetMessageToEditorSide(data);
        if (data.value != null)
            log.info('CONSOLE NODE [' + this.container.id + '/' + this.id + ']: ' + data.value);
        if (data.dropped)
            log.info('CONSOLE NODE [' +
                this.container.id +
                '/' +
                this.id +
                ']: dropped ' +
                data.dropped +
                ' messages (data rate limitation)');
    }
}
exports.ConsoleNode = ConsoleNode;
container_1.Container.registerNodeType('debug/console', ConsoleNode);
//# sourceMappingURL=console.js.map