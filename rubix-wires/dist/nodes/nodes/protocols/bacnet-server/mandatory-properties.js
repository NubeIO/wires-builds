const bacnet = require('node-bacnet');
const BE = bacnet && bacnet.enum;
const PI = bacnet && BE.PropertyIdentifier;
module.exports = bacnet && {
    [BE.ObjectType.ANALOG_OUTPUT]: [
        PI.PRESENT_VALUE,
        PI.STATUS_FLAGS,
        PI.EVENT_STATE,
        PI.OUT_OF_SERVICE,
        PI.UNITS,
        PI.PRIORITY_ARRAY,
        PI.RELINQUISH_DEFAULT,
    ],
    [BE.ObjectType.ANALOG_INPUT]: [
        PI.PRESENT_VALUE,
        PI.STATUS_FLAGS,
        PI.EVENT_STATE,
        PI.OUT_OF_SERVICE,
        PI.UNITS,
    ],
    [BE.ObjectType.DEVICE]: [
        PI.SYSTEM_STATUS,
        PI.VENDOR_NAME,
        PI.VENDOR_IDENTIFIER,
        PI.MODEL_NAME,
        PI.FIRMWARE_REVISION,
        PI.APPLICATION_SOFTWARE_VERSION,
        PI.PROTOCOL_VERSION,
        PI.PROTOCOL_REVISION,
        PI.PROTOCOL_SERVICES_SUPPORTED,
        PI.PROTOCOL_OBJECT_TYPES_SUPPORTED,
        PI.OBJECT_LIST,
        PI.MAX_APDU_LENGTH_ACCEPTED,
        PI.SEGMENTATION_SUPPORTED,
        PI.APDU_TIMEOUT,
        PI.NUMBER_OF_APDU_RETRIES,
        PI.DEVICE_ADDRESS_BINDING,
        PI.DATABASE_REVISION,
    ],
};
//# sourceMappingURL=mandatory-properties.js.map