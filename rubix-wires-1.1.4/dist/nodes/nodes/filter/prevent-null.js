"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
class FiltersPreventNullNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Prevent Null';
        this.description = "This node filters 'input' values.  All 'input' values are passed to 'output' EXCEPT 'null'.";
        this.addInput('input');
        this.addOutput('output');
        this.properties['value'];
    }
    onInputUpdated() {
        let val = this.getInputData(0);
        if (val != null) {
            this.setOutputData(0, val);
            this.properties['value'] = val;
            this.persistProperties();
        }
    }
    persistProperties() {
        if (!this.container.db)
            return;
        this.container.db.updateNode(this.id, this.container.id, {
            $set: {
                properties: this.properties,
            },
        });
    }
}
container_1.Container.registerNodeType('filter/prevent-null', FiltersPreventNullNode);
//# sourceMappingURL=prevent-null.js.map