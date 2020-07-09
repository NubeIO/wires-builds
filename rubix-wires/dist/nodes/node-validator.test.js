"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_validator_1 = require("./node-validator");
const node_1 = require("./node");
describe('Node Validation', () => {
    describe('Node Array Validation', () => {
        const validator = node_validator_1.default.NodeArrayValidator();
        it('Fail case with JSON Object', () => {
            const output = validator.validate({});
            expect(output.error).toBeTruthy();
        });
        it('Pass case with Empty JSON Array', () => {
            const output = validator.validate([]);
            expect(output.error).toBeFalsy();
            expect(output.value).toMatchObject([]);
        });
        it('Fail case with Invalid JSON Array', () => {
            const output = validator.validate([{}, {}]);
            expect(output.error).toBeTruthy();
        });
        it('Pass case with Invalid JSON Array', () => {
            const input = [
                {
                    cid: 0,
                    id: 117,
                    type: 'point/bool-constant',
                    pos: [401, 251],
                    settings: {
                        value: {
                            description: 'Payload',
                            type: 'dropdown',
                            config: {
                                items: [
                                    { value: false, text: 'false' },
                                    { value: true, text: 'true' },
                                    { value: null, text: 'null' },
                                ],
                            },
                            value: null,
                        },
                    },
                    properties: {},
                    flags: {},
                    outputs: { '0': { name: 'out', type: node_1.Type.BOOLEAN, links: null } },
                    _id: 'c0n117',
                },
            ];
            const options = { allowUnknown: true };
            const output = validator.validate(input, options);
            expect(output.error).toBeFalsy();
        });
    });
});
//# sourceMappingURL=node-validator.test.js.map