"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_node_1 = require("../../container-node");
const container_1 = require("../../container");
const api_1 = require("../../../backend/api");
const node_icons_1 = require("../../node-icons");
const node_1 = require("../../node");
let uiMainIcon = node_icons_1.default.uiMainIcon;
let uiMainColour = node_icons_1.default.uiMainColour;
let compareMainIcon = node_icons_1.default.uiMainIcon;
let compareMainColour = node_icons_1.default.uiMainColour;
const demoPointCreationConfig = {
    code: 'new-point-2',
    kind: 'INPUT',
    type: 'DIGITAL',
    category: 'GPIO',
    unit: {
        type: 'meters_per_second',
        alias: {
            '=1': '11',
            '=2': '22',
            '=3': '33',
        },
    },
    device: 'd7cd3f57-a188-4462-b959-df7a23994c92',
    enabled: true,
};
class PointContainerNode extends container_node_1.ContainerNode {
    constructor(container) {
        super(container);
        this.title = 'Point Output';
        this.description = 'placeholder';
        this.headerColor = uiMainColour;
        this.iconImageUrl = uiMainIcon;
        this.settings['bios_id'] = { description: 'Bios ID', value: '', type: node_1.SettingType.READONLY };
        this.api = new api_1.default();
    }
    onCreated() {
        super.onCreated();
        this.settings['name'].value = 'Point ' + this.sub_container.id;
        if (this.side === container_1.Side.editor)
            return;
        this.api
            .createPoint(demoPointCreationConfig)
            .then(this.handleResponse.bind(this))
            .catch(this.handleError.bind(this));
    }
    handleResponse(response) {
        try {
            const { id } = response.data.resource;
            this.settings['bios_id'].value = id;
            this.persistSettings();
            this.broadcastSettingsToClients();
            this.debugInfo(`Created point with id ${id}`);
        }
        catch (e) {
            this.handleError(e);
        }
    }
    persistSettings() {
        if (!this.container.db)
            return;
        this.container.db.updateNode(this.id, this.container.id, {
            $set: {
                settings: this.settings,
            },
        });
    }
    onRemoved() {
        super.onRemoved();
        if (this.side === container_1.Side.editor)
            return;
        const id = this.settings['bios_id'].value;
        if (!id)
            return;
        this.debugInfo(`Removing point with id ${id}`);
    }
    handleError(e) {
        this.debugErr(e.stack);
    }
}
container_1.Container.registerNodeType('IoT/IoT-point-folder', PointContainerNode);
//# sourceMappingURL=IoT-point-folder.js.map