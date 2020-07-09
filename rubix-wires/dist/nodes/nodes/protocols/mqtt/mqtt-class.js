"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Message {
    constructor(topic, message, qos, retain) {
        qos = qos || 0;
        retain = retain ? '1' : '0';
        topic = typeof topic === 'string' ? topic : (topic || '').toString();
        message = message;
    }
    static publish(topic, val, json, pri) { }
    static birth(topic, val, json, pri) { }
    static death(topic, val, json, pri) { }
    static matchTopic(ts, t) {
        if (ts == '#') {
            return true;
        }
        var re = new RegExp('^' +
            ts
                .replace(/([\[\]\?\(\)\\\\$\^\*\.|])/g, '\\$1')
                .replace(/\+/g, '[^/]+')
                .replace(/\/#$/, '(/.*)?') +
            '$');
        return re.test(t);
    }
}
exports.default = Message;
//# sourceMappingURL=mqtt-class.js.map