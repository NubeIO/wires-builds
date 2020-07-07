"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NodeUtils {
    static persistProperties(self, saveSettings = false, saveProperties = false, saveInputs = false, saveOutputs = false) {
        if (!self.container.db)
            return;
        var setProps = {};
        if (saveSettings)
            setProps['settings'] = self.settings;
        if (saveProperties)
            setProps['properties'] = self.properties;
        if (saveInputs)
            setProps['inputs'] = self.inputs;
        if (saveOutputs)
            setProps['outputs'] = self.outputs;
        self.container.db.updateNode(self.id, self.container.id, {
            $set: setProps,
        });
    }
    static getDeviceID(self) {
        return new Promise((resolve, reject) => {
            try {
                NodeUtils.findMainContainer(self).db.getNodeType('system/platform', (err, docs) => {
                    if (!err) {
                        let output = [];
                        output.push(docs);
                        if (output[0] && output[0][0] && output[0][0].properties) {
                            resolve(output[0][0].properties['deviceID'].trim());
                            return output[0][0].properties['deviceID'].trim();
                        }
                        else {
                        }
                        resolve(output);
                        return output;
                    }
                    else {
                        console.log(err);
                        reject(err);
                    }
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static getClientID(self) {
        return new Promise((resolve, reject) => {
            try {
                NodeUtils.findMainContainer(self).db.getNodeType('system/platform', (err, docs) => {
                    if (!err) {
                        let output = [];
                        output.push(docs);
                        if (output[0] && output[0][0] && output[0][0].settings) {
                            resolve(output[0][0].settings['clientID'].value.trim());
                            return output[0][0].settings['clientID'].value.trim();
                        }
                        else {
                        }
                        resolve(output);
                        return output;
                    }
                    else {
                        console.log(err);
                        reject(err);
                    }
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static findMainContainer(self) {
        if (self.hasOwnProperty('container'))
            return NodeUtils.findMainContainer(self.container);
        else
            return self;
    }
}
exports.default = NodeUtils;
//# sourceMappingURL=node-utils.js.map