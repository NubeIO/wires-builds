"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const utils_1 = require("../../utils");
const container_1 = require("../../container");
const SlackBot = require('slackbots');
class SlackNode extends node_1.Node {
    constructor() {
        super();
        this.title = 'Slack Bot';
        this.description = 'Slack.';
        this.addInput('message', node_1.Type.STRING);
        this.settings['boot-name'] = {
            description: 'Boot Name',
            value: '****',
            type: node_1.SettingType.STRING,
        };
        this.settings['token'] = { description: 'token', value: '****', type: node_1.SettingType.STRING };
        this.settings['group'] = { description: 'group', value: '****', type: node_1.SettingType.STRING };
        this.addOutput('message', node_1.Type.STRING);
        this.addOutput('error', node_1.Type.STRING);
    }
    onInputUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.side !== container_1.Side.server)
                return;
            const group = this.settings['group'].value;
            const token = this.settings['token'].value;
            const bootName = this.settings['boot-name'].value;
            let message = this.getInputData(0);
            this.setOutputData(2, utils_1.default.getTimeStamp());
            this.postOnSlackChannel({ group, message, token, bootName });
        });
    }
    postOnSlackChannel({ group, message, token, bootName }) {
        const bot = new SlackBot({
            token: token,
            name: bootName,
        });
        bot.on('start', () => {
            const params = { icon_emoji: ':robot_face:' };
            bot.postMessageToChannel(group, message, params);
            this.emitResult(true);
        });
        bot.on('error', err => {
            this.emitError(err.message);
        });
    }
    emitResult(body) {
        this.setOutputData(0, body);
        this.setOutputData(1, null);
    }
    emitError(body) {
        this.setOutputData(0, null);
        this.setOutputData(1, body);
    }
}
container_1.Container.registerNodeType('social/slack-bot', SlackNode);
//# sourceMappingURL=slack-bot.js.map