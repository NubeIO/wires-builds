"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('assert');
const bacnet = require('node-bacnet');
const logger = require('logplease').create('bacnet', { color: 4 });
const BE = bacnet && bacnet.enum;
const PI = BE && BE.PropertyIdentifier;
const BACnetObject = require('./bacnet-object');
const BACnetObjectProperty = require('./bacnet-object-property');
const Util = require('./util');
class BACnetDevice extends BACnetObject {
    constructor(deviceInfo, hostInfo = {}, covListener) {
        super(null, deviceInfo.deviceId, BE.ObjectType.DEVICE, deviceInfo.name);
        this.dev = this;
        this.deviceInfo = deviceInfo;
        this.hostInfo = hostInfo;
        this.client = null;
        this.covListener = covListener;
    }
    getProperty(propertyId) {
        switch (propertyId) {
            case PI.APDU_TIMEOUT: {
                const prop = new BACnetObjectProperty(this, propertyId, undefined, true);
                prop._value = this.client._settings.apduTimeout;
                return prop;
            }
            default:
                return super.getProperty(propertyId);
        }
    }
    onUnhandledEvent(msg) {
        if (msg.header.expectingReply) {
            if (msg.header.sender.forwardedFrom) {
                msg.header.sender.forwardedFrom = this.ip;
            }
            const enumType = msg.header.confirmedService ? BE.ConfirmedServiceChoice : BE.UnconfirmedServiceChoice;
            logger.debug('Replying with error for unhandled service:' + BE.getEnumName(enumType, msg.service));
            this.client.errorResponse(msg.header.sender, msg.service, msg.invokeId, BE.ErrorClass.SERVICES, BE.ErrorCode.REJECT_UNRECOGNIZED_SERVICE);
        }
    }
    onRegisterForeignDevice(msg) {
        logger.debug('[recv] Register foreign device:', msg.header.sender.address, 'for TTL', msg.payload.ttl);
        this.bdt[msg.header.sender.address] = msg.payload.ttl;
        this.client.resultResponse(msg.header.sender, BE.BvlcResultFormat.SUCCESSFUL_COMPLETION);
    }
    onWhoIs(msg) {
        logger.debug('onWhoIs');
        if (msg.payload.lowLimit === undefined || msg.payload.highLimit === undefined ||
            (msg.payload.lowLimit <= this.instance && msg.payload.highLimit >= this.instance)) {
            if (msg.header.sender.forwardedFrom) {
                msg.header.sender.forwardedFrom = null;
            }
            logger.debug(msg.header.sender, this.instance, this.getProperty(PI.SEGMENTATION_SUPPORTED).value, this.getProperty(PI.VENDOR_IDENTIFIER).value);
            logger.debug(`[send] Replying to whoIs(${msg.payload.lowLimit}..` + `${msg.payload.highLimit}): iAm ${this.instance} -> ` +
                `${msg.header.sender.address}/${msg.header.sender.forwardedFrom}`);
            this.client.iAmResponse(msg.header.sender, this.instance, this.getProperty(PI.SEGMENTATION_SUPPORTED).value, this.getProperty(PI.VENDOR_IDENTIFIER).value);
        }
    }
    onWriteProperty(data) {
        logger.debug(`onWriteProperty: ${JSON.stringify(data)}`);
        const object = this.getObject(data.payload.objectId.instance, data.payload.objectId.type);
        if (!object) {
            return this.client.errorResponse(data.header.sender, data.service, data.invokeId, BE.ErrorClass.OBJECT, BE.ErrorCode.UNKNOWN_OBJECT);
        }
        let property = object.getProperty(data.payload.value.property.id);
        let property3 = object.getProperty(PI.PRIORITY_ARRAY);
        let value2 = this.encodePropValue(property3);
        if (!property) {
            return this.client.errorResponse(data.header.sender, data.service, data.invokeId, BE.ErrorClass.PROPERTY, BE.ErrorCode.UNKNOWN_PROPERTY);
        }
        if (data.payload.value.property.index === 0xffffffff) {
            let pri = data.payload.value.priority;
            let val = data.payload.value.value[0].value;
            function arrType(arr, pri, value) {
                let i;
                for (i in arr) {
                    let arrNum = parseInt(i) + 1;
                    if (arrNum === pri) {
                        arr[i].value = value;
                    }
                }
                return arr;
            }
            let aa = arrType(value2, pri, val);
            let arr = [];
            let p;
            for (p in aa) {
                arr.push(aa[p].value);
            }
            let priorityValue;
            let priorityNum;
            let priorityArr;
            let q;
            for (q in arr) {
                priorityValue = arr[q];
                priorityNum = parseInt(q) + 1;
                priorityArr = { priorityNum: parseInt(q) + 1, val: arr[q] };
                if (arr[q] != null) {
                    break;
                }
            }
            const inpPresentValue2 = object.addProperty(PI.PRIORITY_ARRAY, BE.ApplicationTags.REAL);
            inpPresentValue2.value = arr;
            const inpPresentValue23 = object.addProperty(PI.PRESENT_VALUE, BE.ApplicationTags.REAL);
            inpPresentValue23.value = priorityValue;
            this.client.simpleAckResponse(data.header.sender, data.service, data.invokeId);
            this.covListener({
                objectType: data.payload.objectId.type,
                objectId: data.payload.objectId.instance,
                presentValue: priorityValue,
                priority: priorityNum,
                priorityArray: arr,
            });
        }
        else {
            let slot = data.payload.value.property.index;
            if (!slot) {
                return this.client.errorResponse(data.header.sender, data.service, data.invokeId, BE.ErrorClass.PROPERTY, BE.ErrorCode.INVALID_ARRAY_INDEX);
            }
            this.client.simpleAckResponse(data.header.sender, data.service, data.invokeId);
        }
    }
    onReadProperty(msg) {
        logger.debug('onReadProperty', msg);
        const propertyName = Util.getEnumName(PI, msg.payload.property.id);
        const typeName = Util.getEnumName(BE.ObjectType, msg.payload.objectId.type);
        const objectIdName = typeName + ':' + msg.payload.objectId.instance;
        logger.debug(`[recv/${msg.header.sender.address}] readProperty: ${objectIdName}/${propertyName}`);
        const object = this.getObject(msg.payload.objectId.instance, msg.payload.objectId.type);
        if (!object) {
            logger.debug(`[send/${msg.header.sender.address}] Requested non-existent ` + `object ${objectIdName}, responding with error`);
            return this.client.errorResponse(msg.header.sender, BE.ConfirmedServiceChoice.READ_PROPERTY, msg.invokeId, BE.ErrorClass.OBJECT, BE.ErrorCode.UNKNOWN_OBJECT);
        }
        let property = object.getProperty(msg.payload.property.id);
        if (!property) {
            logger.debug(`[send/${msg.header.sender.address}] Requested non-existent ` +
                `property ${propertyName} for object ${objectIdName}, responding ` +
                `with error`);
            return this.client.errorResponse(msg.header.sender, BE.ConfirmedServiceChoice.READ_PROPERTY, msg.invokeId, BE.ErrorClass.PROPERTY, BE.ErrorCode.UNKNOWN_PROPERTY);
        }
        if (msg.payload.property.index === 0xffffffff) {
            const content = this.encodePropValue(property);
            this.client.readPropertyResponse(msg.header.sender, msg.invokeId, msg.payload.objectId, msg.payload.property, content);
            logger.debug(`[send/${msg.header.sender.address}] readPropertyResponse@all: ${objectIdName}/${propertyName} => %O`, content);
        }
        else {
            const slot = property.value[msg.payload.property.index];
            if (!slot) {
                return this.client.errorResponse(msg.header.sender, BE.ConfirmedServiceChoice.READ_PROPERTY, msg.invokeId, BE.ErrorClass.PROPERTY, BE.ErrorCode.INVALID_ARRAY_INDEX);
            }
            this.client.readPropertyResponse(msg.header.sender, msg.invokeId, msg.payload.objectId, msg.payload.property, this.encodePropValue(slot));
            logger.debug(`[send/${msg.header.sender.address}] readPropertyResponse@${msg.payload.property.index}: ${objectIdName}/${propertyName}`);
        }
    }
    onReadPropertyMultiple(msg) {
        logger.debug(`onReadPropertyMultiple: ${msg}`);
        logger.debug(`[recv/${msg.header.sender.address}] readPropertyMultiple`);
        const responseList = [];
        const propGroups = msg.payload.properties;
        propGroups.forEach(propGroup => {
            const typeName = Util.getEnumName(BE.ObjectType, propGroup.objectId.type);
            const objectIdName = typeName + ':' + propGroup.objectId.instance;
            const propListFriendly = propGroup.properties.map(prop => Util.getEnumName(PI, prop.id));
            logger.debug(`[recv/${msg.header.sender.address}] readPropertyMultiple: object ${objectIdName}/%o`, propListFriendly);
            logger.debug(`[BE.ObjectTypesSupported.DEVICE ${propGroup.objectId.instance}] readPropertyMultiple: instance ${BE.ASN1_MAX_PROPERTY_ID}`);
            if (propGroup.objectId.type === BE.ObjectTypesSupported.DEVICE &&
                propGroup.objectId.instance === BE.ASN1_MAX_PROPERTY_ID) {
                propGroup.objectId.instance = this.instance;
            }
            const object = this.getObject(propGroup.objectId.instance, propGroup.objectId.type);
            const propList = [];
            propGroup.properties.forEach(item => {
                let content;
                if (!object) {
                    content = [{
                            type: 0,
                            value: {
                                type: 'BacnetError',
                                errorClass: BE.ErrorClass.OBJECT,
                                errorCode: BE.ErrorCode.UNKNOWN_OBJECT,
                            },
                        }];
                }
                else {
                    if (item.id === PI.ALL) {
                        object.getAllPropertyIds().forEach(propertyId => {
                            if (propertyId === PI.PROPERTY_LIST)
                                return;
                            const prop = object.getProperty(propertyId);
                            propList.push({ property: { id: propertyId, index: BE.ASN1_ARRAY_ALL }, value: this.encodePropValue(prop) });
                        });
                        return;
                    }
                    const property = object.getProperty(item.id);
                    if (!property) {
                        content = [{
                                type: 0,
                                value: {
                                    type: 'BacnetError',
                                    errorClass: BE.ErrorClass.PROPERTY,
                                    errorCode: BE.ErrorCode.UNKNOWN_PROPERTY,
                                },
                            }];
                    }
                    else if (item.index === BE.ASN1_ARRAY_ALL) {
                        content = this.encodePropValue(property);
                    }
                    else {
                        const slot = Array.isArray(property.value) && property.value[item.index];
                        if (!slot) {
                            content = [{
                                    type: 0,
                                    value: {
                                        type: 'BacnetError',
                                        errorClass: BE.ErrorClass.PROPERTY,
                                        errorCode: BE.ErrorCode.INVALID_ARRAY_INDEX,
                                    },
                                }];
                        }
                        else {
                            content = this.encodePropValue(slot);
                        }
                    }
                }
                assert(Array.isArray(content));
                propList.push({ property: { id: item.id, index: item.index }, value: content });
            });
            responseList.push({ objectId: { type: propGroup.objectId.type, instance: propGroup.objectId.instance }, values: propList });
        });
        logger.debug(`[send/${msg.header.sender.address}] readPropertyMultiple response: %d objects, %d total properties`, responseList.length, responseList.map(o => o.values.length).reduce((a, b) => a + b));
        this.client.readPropertyMultipleResponse(msg.header.sender, msg.invokeId, responseList);
    }
    onSubscribeCov(msg) {
        logger.debug('onSubscribeCov');
        const typeName = Util.getEnumName(BE.ObjectType, msg.payload.monitoredObjectId.type);
        const objectIdName = typeName + ':' + msg.payload.monitoredObjectId.instance;
        logger.debug(`[recv/${msg.header.sender.address}] subscribeCov: object ${objectIdName}`);
        const object = this.getObject(msg.payload.monitoredObjectId.instance, msg.payload.monitoredObjectId.type);
        if (!object) {
            logger.debug(`${msg.header.sender.address} tried to subscribe to non-existent object ${objectIdName}`);
            logger.debug(`[send/${msg.header.sender.address}] Returning error OBJECT:UNKNOWN_OBJECT`);
            this.client.errorResponse(msg.header.sender, msg.service, msg.invokeId, BE.ErrorClass.OBJECT, BE.ErrorCode.UNKNOWN_OBJECT);
            return;
        }
        object.subscriptions = object.subscriptions.filter(sub => sub.subscriberAddress !== msg.header.sender && sub.subscriberProcessId !==
            msg.payload.subscriberProcessId && sub.lifetime > 0);
        if (msg.payload.lifetime) {
            const sub = {
                subscriberAddress: msg.header.sender,
                monitoredObjectId: msg.payload.monitoredObjectId,
                subscriberProcessId: msg.payload.subscriberProcessId,
                issueConfirmedNotifications: true,
                invokeId: msg.invokeId,
                lifetime: msg.payload.lifetime,
            };
            object.subscriptions.push(sub);
            logger.debug(`Adding subscription to object ${objectIdName} for ${msg.header.sender.address}#${msg.payload.subscriberProcessId}`);
            let propList = [];
            object.getAllPropertyIds().forEach(propertyId => {
                const property = object.getProperty(propertyId);
                propList.push({ property: { id: propertyId }, value: this.encodePropValue(property) });
            });
            this.sendPropertyCov(sub, propList);
        }
        else {
            logger.debug(`Removing subscription to object ${objectIdName} by ${msg.header.sender.address}#${msg.payload.subscriberProcessId}`);
        }
        logger.debug(`[send/${msg.header.sender.address}] simpleAckResponse for subscribeCov`);
        this.client.simpleAckResponse(msg.header.sender, msg.service, msg.invokeId);
    }
    onSubscribeProperty(msg) {
        logger.debug('onSubscribeProperty');
        const typeName = Util.getEnumName(BE.ObjectType, msg.payload.monitoredObjectId.type);
        const objectIdName = typeName + ':' + msg.payload.monitoredObjectId.instance;
        logger.debug(`[recv/${msg.header.sender.address}] subscribeCovProperty: object ${objectIdName}`);
        if (!msg.payload.issueConfirmedNotifications) {
            logger.debug(`Returning error to ${msg.header.sender.address} - unable to subscribe with unconfirmed notifications`);
            logger.debug(`[send/${msg.header.sender.address}] Returning error OBJECT:OPTIONAL_FUNCTIONALITY_NOT_SUPPORTED`);
            this.client.errorResponse(msg.header.sender, msg.service, msg.invokeId, BE.ErrorClass.OBJECT, BE.ErrorCode.OPTIONAL_FUNCTIONALITY_NOT_SUPPORTED);
            return;
        }
        const object = this.getObject(msg.payload.monitoredObjectId.instance, msg.payload.monitoredObjectId.type);
        if (!object) {
            logger.debug(`${msg.header.sender.address} tried to subscribe to non-existent object ${objectIdName}`);
            logger.debug(`[send/${msg.header.sender.address}] Returning error OBJECT:UNKNOWN_OBJECT`);
            this.client.errorResponse(msg.header.sender, msg.service, msg.invokeId, BE.ErrorClass.OBJECT, BE.ErrorCode.UNKNOWN_OBJECT);
            return;
        }
        const property = object.getProperty(msg.payload.monitoredProperty.id);
        const propertyName = Util.getPropName(msg.payload.monitoredProperty.id);
        if (!property) {
            logger.debug(`${msg.header.sender.address} tried to subscribe to non-existent property ${objectIdName}/${propertyName}`);
            logger.debug(`[send/${msg.header.sender.address}] Returning error PROPERTY:UNKNOWN_PROPERTY`);
            this.client.errorResponse(msg.header.sender, msg.service, msg.invokeId, BE.ErrorClass.PROPERTY, BE.ErrorCode.UNKNOWN_PROPERTY);
            return;
        }
        property.subscriptions = property.subscriptions.filter(sub => sub.subscriberAddress !== msg.header.sender && sub.subscriberProcessId !==
            msg.payload.subscriberProcessId && sub.lifetime > 0);
        if (msg.payload.lifetime) {
            const sub = {
                subscriberAddress: msg.header.sender,
                monitoredObjectId: msg.payload.monitoredObjectId,
                subscriberProcessId: msg.payload.subscriberProcessId,
                issueConfirmedNotifications: msg.payload.issueConfirmedNotifications,
                monitoredIndex: msg.payload.monitoredProperty.index,
                invokeId: msg.invokeId,
                lifetime: msg.payload.lifetime,
            };
            property.subscriptions.push(sub);
            logger.debug(`Adding subscription to property ${objectIdName}/${propertyName} for ${msg.header.sender.address}#${msg.payload.subscriberProcessId}`);
            let propList = [];
            propList.push({ property: { id: property.propertyId }, value: this.encodePropValue(property) });
            this.sendPropertyCov(sub, propList);
        }
        else {
            logger.debug(`Removing subscription to ${objectIdName}/${propertyName} by ${msg.header.sender.address}#${msg.payload.subscriberProcessId}`);
        }
        logger.debug(`[send/${msg.header.sender.address}] simpleAckResponse for subscribeCovProperty`);
        this.client.simpleAckResponse(msg.header.sender, msg.service, msg.invokeId);
    }
    onObjectPropertyChanged(object, property) {
        let propList = [];
        propList.push({ property: { id: property.propertyId }, value: this.encodePropValue(property) });
        if (object.subscriptions) {
            object.subscriptions.forEach(sub => {
                const typeName = Util.getEnumName(BE.ObjectType, sub.monitoredObjectId.type);
                const objectIdName = typeName + ':' + sub.monitoredObjectId.instance;
                this.sendPropertyCov(sub, propList);
            });
        }
        if (property.subscriptions) {
            property.subscriptions.forEach(sub => {
                const typeName = Util.getEnumName(BE.ObjectType, sub.monitoredObjectId.type);
                const objectIdName = typeName + ':' + sub.monitoredObjectId.instance;
                const propertyName = Util.getPropName(property.propertyId);
                logger.debug(`[send/${sub.subscriberAddress.address}] confirmedCOVNotification: property ${objectIdName}/${propertyName}`);
                this.sendPropertyCov(sub, propList);
            });
        }
    }
    sendPropertyCov(sub, propList) {
        logger.debug('sendPropertyCov');
        const typeName = Util.getEnumName(BE.ObjectType, sub.monitoredObjectId.type);
        const objectIdName = typeName + ':' + sub.monitoredObjectId.instance;
        logger.debug(`[send/${sub.subscriberAddress.address}] confirmedCOVNotification: object ${objectIdName}, ${propList.length} items`);
        if (sub.issueConfirmedNotifications) {
            this.client.confirmedCOVNotification(sub.subscriberAddress, sub.monitoredObjectId, sub.subscriberProcessId, this.instance, sub.lifetime, propList, { invokeId: sub.invokeId }, err => {
                if (err) {
                    logger.debug(`[recv/${sub.subscriberAddress.address}] confirmedCOVNotification was rejected:`, err);
                }
                else {
                    logger.debug(`[recv/${sub.subscriberAddress.address}] confirmedCOVNotification was ACKed`);
                }
            });
        }
        else {
        }
    }
    encodePropValue(property) {
        let encodedValue = property.value;
        if (!Array.isArray(encodedValue))
            encodedValue = [encodedValue];
        switch (property.typeId) {
            case BE.ApplicationTags.BIT_STRING:
                return [
                    {
                        value: bacnet.createBitstring(encodedValue),
                        type: property.typeId,
                    },
                ];
        }
        return encodedValue.map(item => ({
            value: (() => {
                switch (property.typeId) {
                    case BE.ApplicationTags.NULL:
                    case BE.ApplicationTags.BOOLEAN:
                    case BE.ApplicationTags.UNSIGNED_INTEGER:
                    case BE.ApplicationTags.SIGNED_INTEGER:
                    case BE.ApplicationTags.REAL:
                    case BE.ApplicationTags.DOUBLE:
                    case BE.ApplicationTags.CHARACTER_STRING:
                    case BE.ApplicationTags.ENUMERATED:
                        return item;
                    case BE.ApplicationTags.OBJECTIDENTIFIER:
                        return {
                            type: item.typeId,
                            instance: item.instance,
                        };
                    default:
                        const typeName = Util.getEnumName(BE.ApplicationTags, property.typeId);
                        logger.debug(`No encoding for data type ${typeName}`);
                        throw new Error(`Encoding for data type ${typeName} has not been implemented in bacnet-device yet.`);
                }
            })(),
            type: property.typeId,
        }));
    }
    start() {
        assert(this.deviceInfo.deviceId, 'Cannot create a new device without a deviceId');
        assert(this.deviceInfo.name, 'Cannot create a new device without a name');
        this.addProperty(PI.SYSTEM_STATUS).value = BE.DeviceStatus.OPERATIONAL;
        this.addProperty(PI.VENDOR_NAME).value = 'Nube iO Operations';
        this.addProperty(PI.VENDOR_IDENTIFIER).value = 1173;
        this.addProperty(PI.MODEL_NAME).value = 'nube-io-bacnet';
        this.addProperty(PI.FIRMWARE_REVISION).value = 1;
        this.addProperty(PI.APPLICATION_SOFTWARE_VERSION).value = 1;
        this.addProperty(PI.PROTOCOL_VERSION).value = 1;
        this.addProperty(PI.PROTOCOL_REVISION).value = 1;
        this.addProperty(PI.PROTOCOL_SERVICES_SUPPORTED).value = [
            BE.ServicesSupported.CONFIRMED_COV_NOTIFICATION,
            BE.ServicesSupported.SUBSCRIBE_COV,
            BE.ServicesSupported.READ_PROPERTY,
            BE.ServicesSupported.READ_PROPERTY_MULTIPLE,
            BE.ServicesSupported.WRITE_PROPERTY,
            BE.ServicesSupported.I_AM,
            BE.ServicesSupported.WHO_IS,
            BE.ServicesSupported.SUBSCRIBE_COV_PROPERTY,
        ];
        this.addProperty(PI.MAX_APDU_LENGTH_ACCEPTED).value = 1482;
        this.addProperty(PI.SEGMENTATION_SUPPORTED).value = BE.Segmentation.SEGMENTED_BOTH;
        this.addProperty(PI.NUMBER_OF_APDU_RETRIES).value = 3;
        this.addProperty(PI.DEVICE_ADDRESS_BINDING).value = [];
        this.addProperty(PI.DATABASE_REVISION).value = 1;
        this.dynamicProperties.push(PI.APDU_TIMEOUT);
        if (!this.objects[BE.ObjectType.DEVICE]) {
            this.objects[BE.ObjectType.DEVICE] = {};
        }
        this.objects[BE.ObjectType.DEVICE][this.instance] = this;
        this.ip = this.hostInfo.address;
        this.client = new bacnet({
            adpuTimeout: this.hostInfo.adpuTimeout,
            port: this.hostInfo.port,
            interface: this.hostInfo.address,
            broadcastAddress: this.hostInfo.broadcast,
        });
        this.bdt = {};
        this.subscriptions = [];
        this.client.on('unhandledEvent', this.onUnhandledEvent.bind(this));
        this.client.on('registerForeignDevice', this.onRegisterForeignDevice.bind(this));
        this.client.on('whoIs', this.onWhoIs.bind(this));
        this.client.on('writeProperty', this.onWriteProperty.bind(this));
        this.client.on('readProperty', this.onReadProperty.bind(this));
        this.client.on('readPropertyMultiple', this.onReadPropertyMultiple.bind(this));
        this.client.on('subscribeCov', this.onSubscribeCov.bind(this));
        this.client.on('subscribeProperty', this.onSubscribeProperty.bind(this));
        this.client.reinitializeDevice(this.ip, BE.ReinitializedState.COLDSTART, (err, value) => {
            logger.debug('err: ', err);
            logger.debug('info: ', value);
        });
    }
    stop() {
        if (this.client !== null) {
            this.client.close();
        }
    }
    addPoint(bacnetPoint) {
        if (!bacnetPoint) {
            return null;
        }
        logger.info(`Adding BACnet point ${bacnetPoint.objectType.label}:${bacnetPoint.objectInstance}...`);
        logger.info(`Adding BACnet point ${bacnetPoint.objectType.label}:${bacnetPoint.objectInstance}...`);
        assert(Number.isInteger(bacnetPoint.objectType.value), 'Object type must be a BE.ObjectType value.');
        assert(Number.isInteger(bacnetPoint.objectInstance), 'Instance ID must be an integer.');
        if (!this.objects[bacnetPoint.objectType.value])
            this.objects[bacnetPoint.objectType.value] = {};
        let object = new BACnetObject(this, bacnetPoint.objectInstance, bacnetPoint.objectType.value, bacnetPoint.objectName);
        return (this.objects[bacnetPoint.objectType.value][bacnetPoint.objectInstance] = object);
    }
    updatePoint(bacnetPoint) {
        if (!bacnetPoint) {
            return null;
        }
        let object = this.getObject(bacnetPoint.objectInstance, bacnetPoint.objectType.value);
        logger.info(`Updating BACNet point properties ${bacnetPoint.objectType.label}:${bacnetPoint.objectInstance}...`);
        if (!object) {
            return this.addPoint(bacnetPoint);
        }
        object.addProperty(bacnet.enum.PropertyIdentifier.OBJECT_NAME).value = bacnetPoint.objectName;
        return (this.objects[bacnetPoint.objectType.value][bacnetPoint.objectInstance] = object);
    }
    updateValue(bacnetPoint) {
        if (!bacnetPoint) {
            return null;
        }
        logger.info(`Pushing BACNet point Value ${bacnetPoint.objectType.label}:${bacnetPoint.objectInstance}...`);
        let object = this.getObject(bacnetPoint.objectInstance, bacnetPoint.objectType.value);
        if (!object) {
            return null;
        }
        let pv = bacnetPoint.pointValue;
        object.addProperty(PI.PRESENT_VALUE, BE.ApplicationTags.REAL).value = pv.presentValue;
        object.addProperty(PI.PRIORITY, BE.ApplicationTags.SIGNED_INTEGER).value = pv.priority;
        object.addProperty(PI.PRIORITY_ARRAY, BE.ApplicationTags.REAL).value = Object.values(pv.priorityArray);
        return pv;
    }
    delObject(instance, objectTypeId) {
        assert(Number.isInteger(instance), 'Instance ID must be an integer.');
        assert(Number.isInteger(objectTypeId), 'Object type must be a BE.ObjectType value.');
        logger.debug(`BACNet delete object ${objectTypeId}:${instance}`);
        if (this.objects[objectTypeId]) {
            delete this.objects[objectTypeId][instance];
        }
    }
}
exports.default = BACnetDevice;
//# sourceMappingURL=bacnet-device.js.map