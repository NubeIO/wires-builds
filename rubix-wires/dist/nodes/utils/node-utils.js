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
}
exports.default = NodeUtils;
//# sourceMappingURL=node-utils.js.map