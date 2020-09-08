"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const node_io_1 = require("../../node-io");
class BaseScheduleNode extends node_1.Node {
    constructor() {
        super();
        this.settings['id'] = { description: 'ID', value: '', type: node_1.SettingType.READONLY };
        this.addInput('input', node_io_1.Type.STRING);
        this.addOutput('inserted', node_io_1.Type.BOOLEAN);
        this.addOutput('updated', node_io_1.Type.BOOLEAN);
        this.addOutput('error', node_io_1.Type.STRING);
    }
    onInputUpdated() {
        if (this.side !== container_1.Side.server)
            return;
        const id = this.settings['id'].value;
        const rawInput = this.getInputData(0);
        let jsonInput;
        try {
            jsonInput = JSON.parse(rawInput);
        }
        catch (e) {
            this.setOutputs(false, false, e);
            return;
        }
        const validateOutput = this.validator().validate(jsonInput);
        if (validateOutput.error) {
            this.setOutputs(false, false, validateOutput.error.toString());
            return;
        }
        if (id) {
            this.updateSchedule(validateOutput.value, this.settings['id'].value);
        }
        else {
            this.insertSchedule(validateOutput.value);
        }
    }
    setOutputs(...outputs) {
        outputs.forEach((output, index) => {
            this.setOutputData(index, output);
        });
    }
    onRemoved() {
        if (this.side !== container_1.Side.server)
            return;
        const _id = this.settings['id'].value;
        return new Promise((resolve, reject) => {
            if (_id)
                this.container.db.removeSchedule({ _id }, err => reject(err));
            else
                resolve();
        });
    }
    insertSchedule(data) {
        this.container.db.addSchedule(Object.assign(Object.assign({}, data), { type: this.scheduleType() }), (err, doc) => {
            if (err) {
                this.setOutputs(false, false, err);
            }
            else {
                this.setOutputs(true, false, null);
                this.settings['id'].value = doc._id;
                this.broadcastSettingsToClients();
                this.persistConfiguration();
            }
        });
    }
    updateSchedule(data, _id) {
        this.container.db.updateSchedule({ _id }, Object.assign(Object.assign({}, data), { type: this.scheduleType() }), err => {
            if (err) {
                this.setOutputs(false, false, err);
            }
        }, updated => {
            if (updated) {
                this.setOutputs(false, true, null);
                this.persistConfiguration();
            }
            else {
                this.insertSchedule(data);
            }
        });
    }
}
exports.default = BaseScheduleNode;
//# sourceMappingURL=base-schedule.js.map