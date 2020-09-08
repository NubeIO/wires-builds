"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
const os = require('os');
function getSysInfo(val) {
    switch (val) {
        case 0:
            return os.totalmem() / 1048576;
        case 1:
            return os.freemem() / 1048576;
        case 2:
            return os.networkInterfaces();
        case 3:
            return os.hostname();
        case 4:
            return os.platform();
        case 5:
            return os.uptime();
        case 6:
            return os.homedir();
        case 7:
            return os.arch();
        case 8:
            return os.loadavg();
        default:
            return;
    }
}
class SystemInfo extends node_1.Node {
    constructor() {
        super();
        this.title = 'System Info';
        this.description =
            'This node outputs various linux system information.  Once a system property has been selected from settings, a ‘false’ to ‘true’ transition on the ‘trigger’ input will update the ‘output’.  ‘error’ will display error information if the request is not successful.';
        this.addInput('trigger', node_io_1.Type.BOOLEAN);
        this.addOutput('output', node_io_1.Type.STRING);
        this.addOutput('error', node_io_1.Type.STRING);
        this.settings['output-type'] = {
            description: 'Output type',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: [
                    { value: 0, text: 'total memory' },
                    { value: 1, text: 'free memory' },
                    { value: 2, text: 'Network Interfaces' },
                    { value: 3, text: 'hostname' },
                    { value: 4, text: 'platform' },
                    { value: 5, text: 'uptime in sec' },
                    { value: 6, text: 'home dir' },
                    { value: 7, text: 'arch' },
                    { value: 8, text: 'System load average' },
                ],
            },
        };
    }
    onCreated() {
        this.onAfterSettingsChange();
    }
    onAdded() {
        this.updateTitle();
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
        if (!this.settings['output-type'].value)
            return;
        this.updateTitle();
    }
    updateTitle() {
        const settingsConfig = this.settings['output-type'].config.items;
        const settingsText = [JSON.stringify(this.settings['output-type'].value)];
        const filteredNodeSettings = Object.keys(settingsConfig)
            .filter(key => settingsText.includes(key))
            .reduce((obj, key) => {
            obj[key] = settingsConfig[key].text;
            return obj;
        }, {});
        const settingValue = this.settings['output-type'].value;
        this.title = 'System Info' + ' ' + '(' + filteredNodeSettings[settingValue] + ')';
    }
    onInputUpdated() {
        const outType = this.settings['output-type'].value;
        try {
            let call = getSysInfo(outType);
            this.setOutputData(0, call);
            this.setOutputData(1, false);
        }
        catch (e) {
            this.setOutputData(1, true);
        }
    }
}
container_1.Container.registerNodeType('system/system-info', SystemInfo);
//# sourceMappingURL=system-info.js.map