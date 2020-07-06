"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const file_utils_1 = require("../../utils/file-utils");
class PasswordNode extends node_1.Node {
    constructor() {
        super();
        this.errorNoFilename = 'Cant read file.';
        this.title = 'Nube Password';
        this.description =
            'This node is used to retrieve the Nube API password for the local device.  The Nube API password is used with the nube/login node to authenticate with Nube devices (see nube/login node, above).  ‘password’ output will be a String of the Nube API password for the local device.';
        this.settings[''] = { description: '' };
        this.addOutput('password', node_1.Type.STRING);
    }
    onAdded() {
        const fileName = 'admin_password.txt';
        const dbPath = '/data/edge-api/db';
        const filePath = `${dbPath}/${fileName}`;
        try {
            file_utils_1.default.readFile(filePath)
                .then(data => {
                this.setOutputData(0, data.toString());
            })
                .catch(err => {
                this.setOutputData(0, 'Error: Cant find password');
                this.debugWarn(err);
                return;
            });
        }
        catch (error) {
            this.setOutputData(0, 'Error: Cant find password');
            this.debugWarn(error);
            return;
        }
    }
    onAfterSettingsChange() {
        this.onAdded();
    }
}
exports.PasswordNode = PasswordNode;
container_1.Container.registerNodeType('nube/password', PasswordNode);
//# sourceMappingURL=password.js.map