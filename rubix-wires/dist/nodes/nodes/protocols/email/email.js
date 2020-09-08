"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../../node");
const container_1 = require("../../../container");
const nodemailer = require("nodemailer");
const node_io_1 = require("../../../node-io");
const crypto_utils_1 = require("../../../utils/crypto-utils");
const utils_1 = require("../../../utils");
class EmailNode extends node_1.Node {
    constructor() {
        super();
        this.services = ['Gmail', 'Hotmail', 'Outlook365', 'Yahoo'].map(service => {
            return { value: service, text: service };
        });
        this.title = 'Email';
        this.description =
            "Once configured (in settings) with the sender email server details ('email' and 'password') for Gmail, Hotmail, Outlook365, or Yahoo accounts: This node will attempt to send a new email when 'trigger' transitions from 'false' to 'true'.   The String 'recipient' value will be the to: email address; The String 'subject' value will be the email subject; and the String 'message' value will be the email body.  The 'response' output will be 'true' if the email is sent successfully.  The 'error' output will be an error message String if there is an error sending the email. ";
        this.settings['service'] = {
            description: 'Service',
            value: this.services[0].value,
            type: node_1.SettingType.DROPDOWN,
            config: {
                items: this.services,
            },
        };
        this.settings['user'] = { description: 'Email', value: '', type: node_1.SettingType.STRING };
        this.settings['pass'] = { description: 'Password', value: '', type: node_1.SettingType.PASSWORD };
        this.addInput('trigger', node_io_1.Type.BOOLEAN);
        this.addInputWithSettings('recipient', node_io_1.Type.STRING, '', 'To', false);
        this.addInputWithSettings('subject', node_io_1.Type.STRING, '', 'Subject', false);
        this.addInputWithSettings('message', node_io_1.Type.STRING, '', 'Message', false);
        this.addOutput('response', node_io_1.Type.STRING);
        this.addOutput('error', node_io_1.Type.STRING);
    }
    onInputUpdated() {
        if (this.side !== container_1.Side.server)
            return;
        let trigger = this.getInputData(0);
        if (!utils_1.default.hasInput(trigger))
            trigger = false;
        if (trigger == this.lastTrigger)
            return;
        else
            this.lastTrigger = trigger;
        if (trigger == false)
            return;
        const service = this.settings['service'].value;
        const user = this.settings['user'].value;
        const from = user;
        const pass = this.settings['pass'].value;
        const to = this.getInputData(1);
        const subject = this.getInputData(2);
        const text = this.getInputData(3);
        const transporter = nodemailer.createTransport({
            service,
            auth: { user, pass: crypto_utils_1.default.decrypt(pass) },
        });
        transporter.sendMail({ from, to, subject, text }, error => {
            if (error) {
                this.emitError(error.message);
            }
            else {
                this.emitResult(true);
            }
        });
    }
    emitResult(result) {
        this.setOutputData(0, result);
        this.setOutputData(1, null);
    }
    emitError(body) {
        this.setOutputData(0, null);
        this.setOutputData(1, body);
    }
}
container_1.Container.registerNodeType('protocols/misc/email', EmailNode);
//# sourceMappingURL=email.js.map