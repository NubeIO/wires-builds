"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../../node");
const container_1 = require("../../../container");
const axios_1 = require("axios");
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["POST"] = "POST";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["DELETE"] = "DELETE";
    HttpMethod["PATCH"] = "PATCH";
})(HttpMethod || (HttpMethod = {}));
class HttpClientNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'HTTP client';
        this.description =
            'Sends a HTTP(S) request to the specified URL, using the specified request method. ' +
                'The request will be triggered when data is received on the inlet. ' +
                'For PUT/POST/PATCH requests, the received data string will be submitted as the request body. ' +
                Object.keys(HttpMethod).join('/') +
                ' requests are supported.';
        this.addInput('request body');
        this.addOutput('response');
        this.settings['enable'] = { description: 'Enable', value: true, type: node_1.SettingType.BOOLEAN };
        this.settings['method'] = {
            description: 'Request Method',
            value: HttpMethod.GET,
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: Object.keys(HttpMethod),
            },
        };
        this.settings['url'] = { description: 'HTTP URL', value: 'http://', type: node_1.SettingType.STRING };
    }
    onInputUpdated() {
        if (!this.isEnabled())
            return;
        const methodsWithBody = [HttpMethod.PATCH, HttpMethod.PUT, HttpMethod.POST].map(v => v.toString().toLowerCase());
        const url = this.getSanitizedUrl();
        const method = this.getSanitizedMethod();
        const input_data = this.inputs[0].data;
        const data = methodsWithBody.includes(method) && typeof input_data === 'object' ? input_data : undefined;
        try {
            this.validateMethod(method);
            axios_1.default.request({ url, method, data }).then(r => this.setOutputData(0, r.data), e => this.debugErr(e.message));
        }
        catch (e) {
            this.debugErr(e.message);
        }
    }
    isEnabled() {
        return this.settings['enable'].value;
    }
    getSanitizedUrl() {
        return this.settings['url'].value.trim();
    }
    getSanitizedMethod() {
        return this.settings['method'].value.trim().toLowerCase();
    }
    validateMethod(method) {
        if (Object.keys(HttpMethod).indexOf(method.toUpperCase()) === -1) {
            throw new Error('Unknown HTTP request method: ' + method);
        }
    }
    onCreated() { }
    onAdded() { }
    onAfterSettingsChange() { }
}
container_1.Container.registerNodeType('protocols/http-client', HttpClientNode);
//# sourceMappingURL=http-client.js.map