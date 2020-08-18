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
const node_1 = require("../../../node");
const container_1 = require("../../../container");
const child_process_1 = require("child_process");
const fs = require("fs");
const crypto_utils_1 = require("../../../utils/crypto-utils");
class MqttBroker extends node_1.Node {
    constructor() {
        super();
        this.title = 'MQTT Broker';
        this.description = '.';
        this.addInput('ping broker', node_1.Type.STRING);
        this.addOutput('status', node_1.Type.STRING);
        this.addOutput('error', node_1.Type.STRING);
        this.addOutput('debug', node_1.Type.STRING);
        this.settings['enable'] = {
            description: 'Broker enable',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['authentication'] = {
            description: 'Use Authentication',
            value: false,
            type: node_1.SettingType.BOOLEAN,
        };
        this.settings['username'] = { description: 'User name', value: '', type: node_1.SettingType.STRING };
        this.settings['password'] = { description: 'Password', value: '', type: node_1.SettingType.PASSWORD };
        this.setSettingsConfig({
            groups: [
                { enable: {}, authentication: {} },
                { username: {}, password: {} },
            ],
            conditions: {
                username: setting => {
                    return !!setting['authentication'].value;
                },
                password: setting => {
                    return !!setting['authentication'].value;
                },
            },
        });
        this.properties['useAuthentication'];
    }
    onRemoved() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stopBroker()
                .then(e => {
                console.log(e);
            })
                .catch(err => {
                console.log(err);
            });
        });
    }
    onInputUpdated() {
        if (this.side !== container_1.Side.server)
            return;
        const username = this.settings['username'].value;
        const password = this.settings['password'].value;
        const decryptPass = { username, password: crypto_utils_1.default.decrypt(password) };
        console.log('password', decryptPass);
        this.statusBroker()
            .then(e => {
            this.setOutputData(0, e);
            this.setOutputData(1, false);
        })
            .catch(err => {
            this.setOutputData(0, false);
            this.setOutputData(1, true);
        });
    }
    onAfterSettingsChange() {
        const enable = this.settings['enable'].value;
        if (enable) {
            this.startBroker()
                .then(e => {
                this.onInputUpdated();
            })
                .catch(err => {
                this.setOutputData(0, false);
                this.setOutputData(1, true);
            });
            this.checkAuthentication();
        }
        else if (enable === false) {
            this.stopBroker()
                .then(e => {
                this.onInputUpdated();
            })
                .catch(err => {
                this.onInputUpdated();
            });
        }
    }
    stopBroker() {
        return new Promise((resolve, reject) => {
            let command = `sudo systemctl stop mosquitto`;
            child_process_1.exec(command, (err, stdout, stderr) => {
                if (err) {
                    reject({ err, stderr });
                }
                else {
                    resolve(stdout);
                }
            });
        });
    }
    statusBroker() {
        return new Promise((resolve, reject) => {
            let command = `ps -A | grep -i mosquitto | grep -v grep`;
            child_process_1.exec(command, (err, stdout, stderr) => {
                if (err) {
                    reject(false);
                }
                else {
                    resolve(true);
                }
            });
        });
    }
    startBroker() {
        return new Promise((resolve, reject) => {
            let command = `sudo systemctl start mosquitto`;
            child_process_1.exec(command, (err, stdout, stderr) => {
                if (err) {
                    console.log(err);
                    reject({ err, stderr });
                }
                else {
                    resolve(stdout);
                }
            });
        });
    }
    checkAuthentication() {
        const path = '/etc/mosquitto/';
        const configFile = 'mosquitto.conf';
        const passwordFile = 'MQTTPasswords.txt';
        if (this.settings['authentication'].value && !this.properties['useAuthentication']) {
            this.properties['useAuthentication'] = this.settings['authentication'].value;
            const username = this.settings['username'].value;
            const password = this.settings['password'].value;
            if (!username || !password) {
                this.setOutputData(1, 'Invalid Credentials');
                this.debugErr('Invalid Credentials');
                return;
            }
            const command = 'sudo mosquitto_passwd -U ' + path + passwordFile;
            fs.writeFile(path + passwordFile, username + ':' + password, err => {
                if (err) {
                    this.setOutputData(1, err);
                    this.debugErr(err);
                    return;
                }
                try {
                    child_process_1.exec(command, (err, stdout, stderr) => {
                        if (stdout) {
                            this.setOutputData(1, stdout);
                            this.debugErr(stdout);
                            return;
                        }
                        if (err) {
                            this.setOutputData(1, err);
                            this.debugErr(err);
                            return;
                        }
                        if (stderr) {
                            this.setOutputData(1, stderr);
                            this.debugErr(stderr);
                            return;
                        }
                    });
                    fs.readFile(path + configFile, (err, buff) => {
                        if (err) {
                            this.setOutputData(1, err);
                            this.debugErr(err);
                            return;
                        }
                        let text = buff.toString('utf8');
                        this.setOutputData(2, text);
                        const allowAnonymousIndex = text.indexOf('allow_anonymous ');
                        if (allowAnonymousIndex >= 0) {
                            const allowAnonymous = text.slice(allowAnonymousIndex, allowAnonymousIndex + 22);
                            let allowAnonymousArray = allowAnonymous.split(' ');
                            if (allowAnonymousArray[1] == 'true')
                                allowAnonymousArray[1] = 'false';
                            text.replace(allowAnonymous, allowAnonymousArray[0] + ' ' + allowAnonymousArray[1] + '       \n');
                        }
                        else {
                            text += '\nallow_anonymous true     \n';
                        }
                        const passwordRefIndex = text.indexOf('password_file ');
                        if (passwordRefIndex >= 0) {
                            const passwordRef = text.slice(passwordRefIndex, passwordRefIndex + 50);
                            let passwordRefArray = passwordRef.split(' ');
                            if (passwordRefArray[1] !== path + passwordFile) {
                                passwordRefArray[1] = path + passwordFile;
                                text = text.replace(passwordRef, passwordRefArray[0] + ' ' + passwordRefArray[1] + '       \n');
                            }
                        }
                        else {
                            text += '\npassword_file /etc/mosquitto/MQTTPasswords.txt     \n';
                        }
                        fs.writeFile(path + configFile, text, err => {
                            if (err) {
                                this.setOutputData(1, err);
                                this.debugErr(err);
                                return;
                            }
                        });
                        child_process_1.exec('sudo systemctl restart mosquitto', (err, stdout, stderr) => {
                            if (stdout) {
                                this.setOutputData(1, stdout);
                                this.debugErr(stdout);
                                return;
                            }
                            if (err) {
                                this.setOutputData(1, err);
                                this.debugErr(err);
                                return;
                            }
                            if (stderr) {
                                this.setOutputData(1, stderr);
                                this.debugErr(stderr);
                                return;
                            }
                        });
                    });
                }
                catch (e) {
                    this.setOutputData(1, e);
                    this.debugErr(e);
                    return;
                }
            });
        }
        else if (!this.settings['authentication'].value && this.properties['useAuthentication']) {
            this.properties['useAuthentication'] = this.settings['authentication'].value;
            fs.unlink(path + passwordFile, err => {
                if (err) {
                    this.setOutputData(2, err);
                    this.debugErr(err);
                    return;
                }
            });
            fs.readFile(path + configFile, (err, buff) => {
                if (err) {
                    this.setOutputData(1, err);
                    this.debugErr(err);
                    return;
                }
                let text = buff.toString('utf8');
                this.setOutputData(2, text);
                const allowAnonymousIndex = text.indexOf('allow_anonymous ');
                if (allowAnonymousIndex >= 0) {
                    const allowAnonymous = text.slice(allowAnonymousIndex, allowAnonymousIndex + 22);
                    let allowAnonymousArray = allowAnonymous.split(' ');
                    if (allowAnonymousArray[1] == 'false')
                        allowAnonymousArray[1] = 'true';
                    text = text.replace(allowAnonymous, allowAnonymousArray[0] + ' ' + allowAnonymousArray[1] + '   ');
                }
                else {
                    text += '\nallow_anonymous false     \n';
                }
                fs.writeFile(path + configFile, text, err => {
                    if (err) {
                        this.setOutputData(1, err);
                        this.debugErr(err);
                        return;
                    }
                });
                child_process_1.exec('sudo systemctl restart mosquitto', (err, stdout, stderr) => {
                    if (stdout) {
                        this.setOutputData(1, stdout);
                        this.debugErr(stdout);
                        return;
                    }
                    if (err) {
                        this.setOutputData(1, err);
                        this.debugErr(err);
                        return;
                    }
                    if (stderr) {
                        this.setOutputData(1, stderr);
                        this.debugErr(stderr);
                        return;
                    }
                });
            });
        }
    }
}
container_1.Container.registerNodeType('protocols/mqtt-broker/mqtt-broker', MqttBroker);
//# sourceMappingURL=mqtt-broker.js.map