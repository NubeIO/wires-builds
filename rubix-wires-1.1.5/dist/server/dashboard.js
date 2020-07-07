"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const debounce_1 = require("lodash-decorators/debounce");
class Dashboard {
    constructor(socket) {
        this.socket = socket;
        this.uiPanels = [];
    }
    loadFromDatabase(db) {
        this.db = db;
        db.getUiPanels((err, docs) => {
            if (err)
                return console.log(err);
            this.uiPanels = docs || [];
        });
    }
    onNodeRemoved(node) {
        if (!node.isDashboardNode)
            return;
        this.removeElementForNode(node);
        this.removeEmptyPanels();
        this.sendUiPanel(node.settings['ui-panel'].value);
    }
    onNodeChangePanelOrTitle(node, newPanelName, newTitle) {
        this.removeElementForNode(node);
        const uiElemet = {
            title: newTitle,
            type: node.uiElementType,
            cid: node.container.id,
            id: node.id,
            name: node.name,
        };
        let newPanel = this.getUiPanel(newPanelName);
        if (!newPanel) {
            newPanel = this.addUiPanel(newPanelName);
            newPanel.subPanels[0].uiElements.push(uiElemet);
            if (this.db)
                this.db.addUiPanel(newPanel);
        }
        else {
            newPanel.subPanels[0].uiElements.push(uiElemet);
            if (this.db)
                this.db.updateUiPanel(newPanel.name, { $set: { subPanels: newPanel.subPanels } });
        }
        this.removeEmptyPanels();
        this.socket.io.emit('getUiPanelsList', this.getUiPanelsList());
        this.sendUiPanel(node.settings['ui-panel'].value);
    }
    sendUiPanel(uiPanelValue) {
        this.socket.io.emit('getUiPanel', this.getUiPanel(uiPanelValue));
    }
    removeEmptyPanels() {
        let changed = false;
        for (let p = 0; p < this.uiPanels.length; p++) {
            let panel = this.uiPanels[p];
            if (panel.subPanels.every(s => s.uiElements.length == 0)) {
                changed = true;
                this.uiPanels = this.uiPanels.filter(pan => pan.name != panel.name);
                if (this.db)
                    this.db.removeUiPanel(panel.name);
            }
        }
        if (changed)
            this.socket.io.emit('getUiPanelsList', this.getUiPanelsList());
    }
    removeElementForNode(node) {
        const oldPanel = this.getUiPanel(node.settings['ui-panel'].value);
        if (oldPanel) {
            for (let s = 0; s < oldPanel.subPanels.length; s++) {
                const subPanel = oldPanel.subPanels[s];
                for (let e = 0; e < subPanel.uiElements.length; e++) {
                    const element = subPanel.uiElements[e];
                    if (element.cid == node.container.id && element.id == node.id) {
                        subPanel.uiElements.splice(e, 1);
                        if (this.db)
                            this.db.updateUiPanel(oldPanel.name, { $set: { subPanels: oldPanel.subPanels } });
                    }
                }
            }
        }
    }
    getUiPanel(name) {
        return this.uiPanels.find(p => p.name === name);
    }
    getUiPanelsList() {
        let arr = [];
        this.uiPanels.forEach(p => {
            arr.push({ name: p.name, title: p.title, icon: p.icon });
        });
        return arr;
    }
    addUiPanel(name) {
        const subPanel = {
            title: '',
            name: '',
            uiElements: [],
        };
        const panel = {
            name: name,
            title: name,
            icon: 'label_outline',
            subPanels: [subPanel],
        };
        this.uiPanels.push(panel);
        return panel;
    }
}
__decorate([
    debounce_1.default(100)
], Dashboard.prototype, "sendUiPanel", null);
exports.Dashboard = Dashboard;
//# sourceMappingURL=dashboard.js.map