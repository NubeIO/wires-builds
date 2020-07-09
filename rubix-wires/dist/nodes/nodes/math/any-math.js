"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const utils_1 = require("../../utils");
class AnyMathNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'flexible math';
        this.description = '';
        this.addInput('in 1', node_1.Type.NUMBER);
        this.addOutput('out', node_1.Type.NUMBER);
        this.addOutput('operation', node_1.Type.STRING);
        this.addOutput('pass through', node_1.Type.NUMBER);
        this.settings['select'] = {
            description: 'Select Operation',
            value: '+',
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: Object.values(utils_1.default.operatorsMathName),
            },
        };
        this.settings['compare'] = { description: 'Constant', value: 0, type: node_1.SettingType.NUMBER };
    }
    onInputUpdated() {
        let val = this.getInputData(0);
        const select = this.settings['select'].value;
        const compare = this.settings['compare'].value;
        function checkMethod(n, a, b) {
            switch (n) {
                case '+':
                    return parseFloat(a) + parseFloat(b);
                case '-':
                    return a - b;
                case '/':
                    return a / b;
                case '*':
                    return a * b;
                case 'min':
                    return Math.min(a, b);
                case 'max':
                    return Math.max(a, b);
            }
        }
        let result = checkMethod(select, val, compare);
        this.setOutputData(0, result);
        this.setOutputData(1, select + ' ' + ' ' + compare);
        this.setOutputData(2, val);
    }
    onAfterSettingsChange() {
        this.onInputUpdated();
    }
}
container_1.Container.registerNodeType('math/any-math', AnyMathNode);
//# sourceMappingURL=any-math.js.map