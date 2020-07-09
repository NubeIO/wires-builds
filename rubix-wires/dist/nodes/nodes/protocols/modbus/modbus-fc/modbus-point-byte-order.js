"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ModbusByteOrder {
}
exports.default = ModbusByteOrder;
ModbusByteOrder.TYPES = {
    INT16: 1,
    UINT16: 2,
    INT32: 3,
    UINT32: 4,
    FLOAT32: 5,
    INT64: 6,
    UINT64: 7,
    DOUBLE64: 8,
};
ModbusByteOrder.ENDIAN = {
    LEB_BEW: 0,
    LEB_LEW: 1,
    BEB_LEW: 2,
    BEB_BEW: 3,
};
ModbusByteOrder.readByteOrder = (buffer, offset, type, endian) => {
    let TYPES = ModbusByteOrder.TYPES;
    let ENDIAN = ModbusByteOrder.ENDIAN;
    let buf;
    let value;
    try {
        if (type <= TYPES.UINT16) {
            buf = buffer.slice(offset, offset + 2);
        }
        else if (type <= TYPES.FLOAT32) {
            buf = buffer.slice(offset, offset + 4);
        }
        else {
            buf = buffer.slice(offset, offset + 8);
        }
        if (endian === ENDIAN.BEB_LEW || (type <= TYPES.UINT16 && endian === ENDIAN.BEB_BEW)) {
            buf.swap16();
        }
        else if (type > TYPES.UINT16 && type <= TYPES.FLOAT32 && endian === ENDIAN.BEB_BEW) {
            buf.swap32();
        }
        else if (type >= TYPES.INT64 && endian === ENDIAN.BEB_BEW) {
            buf.swap64();
        }
    }
    catch (error) {
        console.log(`buffer readValue issue in modbus-point-methods. Buffer.alloc ${error}`);
    }
    try {
        switch (type) {
            case TYPES.INT16:
                value = buf.readInt16LE(value);
                break;
            case TYPES.UINT16:
                value = buf.readUInt16LE(value);
                break;
            case TYPES.INT32:
                value = buf.readInt32LE(value);
                break;
            case TYPES.UINT32:
                value = buf.readUInt32LE(value);
                break;
            case TYPES.FLOAT32:
                value = buf.readFloatLE(value);
                break;
            case TYPES.INT64:
                break;
            case TYPES.UINT64:
                break;
            case TYPES.DOUBLE64:
                value = buf.readDoubleLE(value);
                break;
        }
    }
    catch (error) {
        console.log(`buffer readValue issue in modbus-point-methods. switch case ${error}`);
    }
    return value;
};
ModbusByteOrder.writeValue = (value, type, endian) => {
    let TYPES = ModbusByteOrder.TYPES;
    let ENDIAN = ModbusByteOrder.ENDIAN;
    let buf;
    try {
        if (type <= TYPES.UINT16) {
            buf = Buffer.alloc(2);
        }
        else if (type <= TYPES.FLOAT32) {
            buf = Buffer.alloc(4);
        }
        else {
            buf = Buffer.alloc(8);
        }
    }
    catch (error) {
        console.log(`buffer writeValue issue in modbus-point-methods. Buffer.alloc  ${error}`);
    }
    try {
        switch (type) {
            case TYPES.INT16:
                buf.writeInt16LE(value);
                break;
            case TYPES.UINT16:
                buf.writeUInt16LE(value);
                break;
            case TYPES.INT32:
                buf.writeInt32LE(value);
                break;
            case TYPES.UINT32:
                buf.writeUInt32LE(value);
                break;
            case TYPES.FLOAT32:
                buf.writeFloatLE(value);
                break;
            case TYPES.INT64:
                break;
            case TYPES.UINT64:
                break;
            case TYPES.DOUBLE64:
                buf.writeDoubleLE(value);
                break;
        }
    }
    catch (error) {
        console.log(`buffer writeValue issue in modbus-point-methods :switch case ${error}`);
    }
    try {
        if (endian === ENDIAN.BEB_LEW || (type <= TYPES.UINT16 && endian === ENDIAN.BEB_BEW)) {
            buf.swap16();
        }
        else if (type > TYPES.UINT16 && type <= TYPES.FLOAT32 && endian === ENDIAN.BEB_BEW) {
            buf.swap32();
        }
        else if (type >= TYPES.INT64 && endian === ENDIAN.BEB_BEW) {
            buf.swap64();
        }
        return buf;
    }
    catch (error) {
        console.log(`buffer writeValue issue in modbus-point-methods :buf.swap() ${error}`);
    }
};
//# sourceMappingURL=modbus-point-byte-order.js.map