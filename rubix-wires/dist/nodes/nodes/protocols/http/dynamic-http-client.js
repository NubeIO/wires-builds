"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../../node");
const container_1 = require("../../../container");
const axios_1 = require("axios");
class DynamicHttpClientNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'HTTP client';
        this.description =
            'Sends a HTTP(S) request by executing a "axios" configuration JSON object. ' +
                'The request will be triggered when a configuration object is received on the inlet. ' +
                'The configuration object must be the "config" object of the "axios" library.' +
                'For a list of all possible options, see here: https://github.com/axios/axios#request-config';
        this.addInput('configuration');
        this.addOutput('response');
        this.addOutput('errors');
    }
    onInputUpdated() {
        const config = this.inputs[0].data;
        if (!config)
            return;
        try {
            axios_1.default
                .request(config)
                .then(r => this.emitResult(r.data))
                .catch(e => this.emitError(e));
        }
        catch (e) {
            this.emitError(e);
        }
    }
    emitResult(result) {
        this.setOutputData(0, result);
        this.setOutputData(1, null);
    }
    emitError(error) {
        this.setOutputData(0, null);
        this.setOutputData(1, error.stack);
    }
    onCreated() { }
    onAdded() { }
    onAfterSettingsChange() { }
}
container_1.Container.registerNodeType('protocols/dynamic-http-client', DynamicHttpClientNode);
//# sourceMappingURL=dynamic-http-client.js.map