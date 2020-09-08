"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const node_io_1 = require("../../node-io");
const container_1 = require("../../container");
const point_ref_utils_1 = require("../../utils/points/point-ref-utils");
const helper_1 = require("../../../utils/helper");
class PointTagNode extends node_1.Node {
    constructor() {
        super();
        this.deviceId = 0;
        this.pointId = 1;
        this.clientId = 2;
        this.siteId = 3;
        this.clientName = 4;
        this.siteName = 5;
        this.siteAddress = 6;
        this.equipRef = 7;
        this.title = 'Point Tag Node';
        this.description = 'A node generating HVAC tags';
        this.addInputWithSettings('deviceId', node_io_1.Type.STRING, 'device id', 'device id', false);
        this.addInputWithSettings('pointId', node_io_1.Type.STRING, 'point id', 'point id/name', false);
        this.addInputWithSettings('clientId', node_io_1.Type.STRING, 'client id', 'client id', false);
        this.addInputWithSettings('clientName', node_io_1.Type.STRING, 'client name', 'Client Name', false);
        this.addInputWithSettings('siteId', node_io_1.Type.STRING, 'site id', 'site id', false);
        this.addInputWithSettings('siteName', node_io_1.Type.STRING, 'site name', 'Site/Building Name', false);
        this.addInputWithSettings('siteAddress', node_io_1.Type.STRING, '123 my street', 'Site/Building Address', false);
        this.addInputWithSettings('equipRef', node_io_1.Type.STRING, 'FCU123', 'Equipment Reference', false);
        this.addOutput('output', node_io_1.Type.JSON);
        this.settings['equipType'] = {
            description: 'Equipment Type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: point_ref_utils_1.default.tagCategory,
            },
        };
        this.settings['tags'] = {
            description: 'Point Type',
            value: null,
            type: node_1.SettingType.DROPDOWN,
        };
        this.settings['tags_values'] = {
            description: 'Auto generated tags values',
            value: null,
            type: node_1.SettingType.READONLY,
        };
    }
    onAdded() {
        this.onAfterSettingsChange();
    }
    onInputUpdated() {
        if (this.side !== container_1.Side.server)
            return;
        const deviceId = this.getInputData(this.deviceId);
        const pointId = this.getInputData(this.pointId);
        const clientId = this.getInputData(this.clientId);
        const clientName = this.getInputData(this.clientName);
        const siteId = this.getInputData(this.siteId);
        const siteName = this.getInputData(this.siteName);
        const siteAddress = this.getInputData(this.siteAddress);
        const equipRef = this.getInputData(this.equipRef);
        const equipType = this.settings['equipType'].value;
        let tagSetting = point_ref_utils_1.default.tagType(equipType);
        if (helper_1.isNull(tagSetting))
            return;
        this.settings['tags'].config = {
            items: Object.keys(tagSetting),
        };
        let pointType = this.settings['tags'].value;
        let tags;
        for (var key in tagSetting) {
            if (key == pointType) {
                tags = tagSetting[key];
            }
        }
        ;
        let pointArr = { pointType: pointType, equipRef: equipRef, equipType: equipType, deviceId: deviceId, pointId: pointId, clientId: clientId, clientName: clientName, siteId: siteId, siteName: siteName, siteAddress: siteAddress };
        if (tags) {
            this.settings['tags_values'].value = tags.tags;
            this.broadcastSettingsToClients();
            tags = tags.tags;
            let pointTags = {};
            tags.forEach(x => { pointTags[x] = x; });
            const out = Object.assign(Object.assign({}, pointArr), pointTags);
            this.setOutputData(0, out);
        }
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('history/point-tags', PointTagNode);
//# sourceMappingURL=point-tag.js.map