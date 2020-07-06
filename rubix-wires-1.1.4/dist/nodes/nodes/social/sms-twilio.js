"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const container_1 = require("../../container");
const Twilio = require('twilio');
class TwilioNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'twilio SMS';
        this.description = 'Send a sms without the need of a sim card using twilio.';
        this.addInputWithSettings('enable', node_1.Type.BOOLEAN, true, 'Enable', false);
        this.addInput('message in', node_1.Type.STRING);
        this.addOutput('result', node_1.Type.STRING);
        this.addOutput('error', node_1.Type.BOOLEAN);
        this.addOutput('error message', node_1.Type.STRING);
        this.settings['cell-numbers'] = {
            description: 'Cell numbers',
            value: '+134345324, +6143789762',
            type: node_1.SettingType.STRING,
        };
        this.settings['twilio-number'] = {
            description: 'Enter your twilio number',
            value: '+19142906413',
            type: node_1.SettingType.STRING,
        };
        this.settings['account-sid'] = {
            description: 'Enter twilio account sid',
            value: '****',
            type: node_1.SettingType.STRING,
        };
        this.settings['auth-token'] = {
            description: 'Enter twilio token',
            value: '****',
            type: node_1.SettingType.STRING,
        };
    }
    onInputUpdated() {
        if (this.side !== container_1.Side.server)
            return;
        let input = this.getInputData(1);
        if (input == null)
            return;
        const phoneNumbers = [this.settings['cell-numbers'].value];
        const twilioNumber = this.settings['twilio-number'].value;
        const accountSid = this.settings['account-sid'].value;
        const authToken = this.settings['auth-token'].value;
        const client = new Twilio(accountSid, authToken);
        let enable = this.getInputData(0);
        if (enable && this.inputs[1].updated) {
            let msg = input.length;
            if (msg >= 160) {
                this.setOutputData(1, true);
                this.setOutputData(2, 'message must be less then 160 characters');
            }
            else if (msg < 1) {
                this.setOutputData(1, true);
                this.setOutputData(2, 'message must be grater then 0 characters');
            }
            else {
                try {
                    phoneNumbers.map(phoneNumber => {
                        if (!validE164(phoneNumber)) {
                            this.setOutputData(1, true);
                            this.setOutputData(2, 'number must be E164 format!');
                        }
                        const textContent = {
                            body: input,
                            to: phoneNumber,
                            from: twilioNumber,
                        };
                        client.messages.create(textContent).then(message => this.setOutputData(0, message));
                    });
                }
                catch (e) {
                    this.setOutputData(1, true);
                    this.setOutputData(2, e);
                }
                function validE164(num) {
                    return /^\+?[1-9]\d{1,14}$/.test(num);
                }
            }
        }
        else if (!enable) {
            this.setOutputData(1, false);
            this.setOutputData(2, 'node is not enabled');
        }
    }
}
container_1.Container.registerNodeType('social/sms-twilio', TwilioNode);
//# sourceMappingURL=sms-twilio.js.map