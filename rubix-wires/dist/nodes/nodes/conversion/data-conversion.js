"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const convert = require("convert-units");
const lodash_1 = require("lodash");
class UnitConversionNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Unit converter';
        this.description = 'This node converts units.';
        this.addInput('in');
        this.addOutput('converted');
        this.settings['from-to'] = {
            description: 'From / To unit',
            type: node_1.SettingType.TREE_SELECT,
            config: { items: [] },
        };
        this.ensureFromToConfig();
    }
    onAdded() {
        this.updateTitle();
        this.ensureFromToConfig();
    }
    ensureFromToConfig() {
        if (!lodash_1.get(this, "settings['from-to'].config.items.length", 0))
            this.settings['from-to'].config = { items: this.createTreeSelectItems() };
        this.settings['from-to'].toJSON = function () {
            const _a = Object.assign({}, this), { config = null } = _a, withoutConfig = __rest(_a, ["config"]);
            return withoutConfig;
        };
    }
    createTreeSelectItems() {
        const asItem = unit => ({ value: unit, text: unit });
        const addAsChildren = (categoryName, units) => from => (Object.assign(Object.assign({}, from), { items: units.map(to => (Object.assign(Object.assign({}, to), { value: { type: categoryName, from: from.value, to: to.value } }))) }));
        return convert()
            .measures()
            .map(unitType => ({
            text: unitType,
            items: convert()
                .possibilities(unitType)
                .map(asItem),
        }))
            .map(category => (Object.assign(Object.assign({}, category), { items: category.items.map(addAsChildren(category.text, category.items)) })));
    }
    onInputUpdated() {
        if (!this.settings['from-to'].value)
            return;
        const { from, to } = this.settings['from-to'].value;
        const value = parseFloat(this.inputs[0].data);
        this.setOutputData(0, convert(value)
            .from(from)
            .to(to));
    }
    onAfterSettingsChange() {
        this.ensureFromToConfig();
        this.onInputUpdated();
        this.updateTitle();
    }
    updateTitle() {
        if (!this.settings['from-to'].value)
            return;
        const { from, to } = this.settings['from-to'].value;
        this.title = 'Unit converter' + ' ' + '(' + from + '/' + to + ')';
    }
}
container_1.Container.registerNodeType('conversion/convert-units', UnitConversionNode);
//# sourceMappingURL=data-conversion.js.map