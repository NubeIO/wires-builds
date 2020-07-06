"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const debounce_1 = require("lodash-decorators/debounce");
class UiNode extends node_1.Node {
    constructor(defaultTitle, uiElementType, properties) {
        super();
        this.name = properties && properties.name;
        this.titlePrefix = defaultTitle;
        this.defaultTitle = defaultTitle;
        this.uiElementType = uiElementType;
        this.isDashboardNode = true;
        this.settings['title'] = {
            description: 'Title',
            value: this.titlePrefix,
            type: node_1.SettingType.STRING,
        };
        this.settings['ui-panel'] = { description: 'Ui Panel Name', type: node_1.SettingType.STRING };
    }
    init() {
        if (this.settings['ui-panel']) {
            this.uiPanelValue = this.settings['ui-panel'] && this.settings['ui-panel'].value;
        }
    }
    onCreated() {
        this.settings['ui-panel'].value = this.uiPanelValue || this.container.name;
        if (this.side == container_1.Side.server) {
            this.container.dashboard.onNodeChangePanelOrTitle(this, this.settings['ui-panel'].value, this.settings['title'].value);
        }
    }
    onAdded() {
        this.changeTitle(this.settings['title'].value);
    }
    onBeforeSettingsChange(newSettings, newName) {
        if (this.side == container_1.Side.server) {
            this.name = newName;
            this.container.dashboard.onNodeChangePanelOrTitle(this, newSettings['ui-panel'].value, newSettings['title'].value);
        }
        this.changeTitle(newSettings['title'].value);
    }
    changeTitle(title) {
        if (this.defaultTitle === title)
            this.title = title;
        else
            this.title = this.defaultTitle + ': ' + title;
    }
    onRemoved() {
        if (this.side == container_1.Side.server)
            this.container.dashboard.onNodeRemoved(this);
    }
    setState(state, sendToDashboard = true) {
        this.properties['state'] = state;
        if (this.container == null)
            return;
        if (sendToDashboard) {
            let m = { id: this.id, cid: this.container.id, state: state };
            if (this.side == container_1.Side.server) {
                let socket = this.container.server_dashboard_socket;
                let panelName = this.settings['ui-panel'].value;
                socket.in('' + panelName).emit('dashboardElementGetNodeState', m);
            }
        }
        this.storeInDatabase();
    }
    storeInDatabase() {
        if (this.container && this.container.db) {
            this.container.db.updateNode(this.id, this.container.id, {
                $set: { properties: this.properties },
            });
        }
    }
    sendMessageToDashboardSide(mess) {
        let m = { id: this.id, cid: this.container.id, message: mess };
        if (this.side == container_1.Side.server) {
            let socket = this.container.server_dashboard_socket;
            let panelName = this.settings['ui-panel'].value;
            socket.in('' + panelName).emit('nodeMessageToDashboardSide', m);
        }
        else {
            this.container.client_socket.emit('nodeMessageToDashboardSide', m);
        }
    }
    getState() {
        return this.properties['state'];
    }
}
__decorate([
    debounce_1.default(1000)
], UiNode.prototype, "storeInDatabase", null);
exports.UiNode = UiNode;
//# sourceMappingURL=ui-node.js.map