"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ValidationResult_1 = require("../../nodes/validation/ValidationResult");
const Validation_1 = require("../../nodes/validation/Validation");
const node_1 = require("../../nodes/node");
const ValidityMixins = () => ({
    data() {
        return {
            isValid: false,
            errorMessage: '',
        };
    },
    mounted() {
        this.valid();
    },
    methods: {
        valid() {
            const validation = this.setting.validation;
            if (!validation) {
                this.isValid = true;
                this.$emit('changeValidity', this.isValid, this.index);
                return;
            }
            if (!Validation_1.isValidForValidation(this.setting.type)) {
                this.isValid = true;
                this.$emit('changeValidity', this.isValid, this.index);
                return;
            }
            let value = this.setting.value;
            if (this.setting.type === node_1.SettingType.NUMBER) {
                if (isNaN(value)) {
                    this.errorMessage = 'Invalid input. Number expected';
                    this.isValid = false;
                    this.$emit('changeValidity', this.isValid, this.index);
                    return;
                }
                else {
                    value = parseInt(this.setting.value);
                }
            }
            const validationResult = validation.validate(value);
            this.errorMessage = validationResult.reason;
            this.isValid = validationResult.validationState === ValidationResult_1.ValidationState.VALID;
            this.$emit('changeValidity', this.isValid, this.index);
        },
    },
    updated: function () {
        this.$nextTick(function () {
            this.valid();
        });
    },
});
exports.default = ValidityMixins;
//# sourceMappingURL=ValidityMixins.js.map