"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enumify_1 = require("enumify");
class ConnectionStatus extends enumify_1.Enumify {
    constructor(label) {
        super();
        this.label = label;
    }
    static lookupByLabel(label) {
        return ConnectionStatus.enumValues.map(e => e).find(value => value.label === label);
    }
    isConnected() {
        return this === ConnectionStatus.CONNECTED;
    }
    isError() {
        return this === ConnectionStatus.ERROR;
    }
    isDisconnected() {
        return this === ConnectionStatus.DISCONNECTED;
    }
    isUnconnected() {
        return this === ConnectionStatus.UNCONNECTED;
    }
}
exports.ConnectionStatus = ConnectionStatus;
ConnectionStatus.CONNECTED = new ConnectionStatus('CONNECTED');
ConnectionStatus.DISCONNECTED = new ConnectionStatus('DISCONNECTED');
ConnectionStatus.ERROR = new ConnectionStatus('ERROR');
ConnectionStatus.UNCONNECTED = new ConnectionStatus('UNCONNECTED');
ConnectionStatus._ = ConnectionStatus.closeEnum();
var HistoryMode;
(function (HistoryMode) {
    HistoryMode[HistoryMode["COV"] = 0] = "COV";
    HistoryMode[HistoryMode["TRIGGERED"] = 1] = "TRIGGERED";
})(HistoryMode = exports.HistoryMode || (exports.HistoryMode = {}));
//# sourceMappingURL=enums.js.map