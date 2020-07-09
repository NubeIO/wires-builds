"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Message {
}
exports.default = Message;
Message.pointTypes = ['AI', 'AO', 'AV', 'BI', 'BO', 'BV', 'MSI', 'MSO', 'MSV'];
Message.inputTypes = [
    '0-10dc',
    '0-5dc',
    '0-20ma',
    '4-20ma',
    '10k thermistor',
    '20k thermistor',
    'raw',
    'digital',
];
Message.outputTypes = ['0-12dc', '0-10dc', 'digital'];
Message.historyTypes = ['cov', 'periodic'];
Message.pointKinds = [
    'number',
    'bool',
    'str',
    'marker',
    'ref',
    'uri',
    'bin',
    'date',
    'time',
    'dateTime',
    'coord',
    'xStr',
    'NA',
];
//# sourceMappingURL=pointTypes.js.map