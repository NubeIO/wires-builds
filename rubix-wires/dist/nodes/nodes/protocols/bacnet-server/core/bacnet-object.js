const bacnet = require('node-bacnet');
const logger = require('logplease').create('bacnet', { color: 6 });
const BACnetObjectProperty = require('./bacnet-object-property');
const MandatoryProperties = require('./mandatory-properties');
const Util = require('./util');
class BACnetObject {
    constructor(dev, instance, typeId, name) {
        this.dev = dev;
        this.instance = instance;
        this.objects = {};
        this.properties = {};
        this.subscriptions = [];
        this.dynamicProperties = [
            bacnet.enum.PropertyIdentifier.OBJECT_IDENTIFIER,
            bacnet.enum.PropertyIdentifier.PROPERTY_LIST,
            bacnet.enum.PropertyIdentifier.OBJECT_LIST,
            bacnet.enum.PropertyIdentifier.PROTOCOL_OBJECT_TYPES_SUPPORTED,
        ];
        this.addProperty(bacnet.enum.PropertyIdentifier.OBJECT_TYPE).value = typeId;
        this.addProperty(bacnet.enum.PropertyIdentifier.OBJECT_NAME).value = name;
        this.addProperty(bacnet.enum.PropertyIdentifier.STATUS_FLAGS).value = [];
        this.addProperty(bacnet.enum.PropertyIdentifier.EVENT_STATE).value =
            bacnet.enum.EventState.NORMAL;
        this.addProperty(bacnet.enum.PropertyIdentifier.OUT_OF_SERVICE).value = false;
        this.addProperty(bacnet.enum.PropertyIdentifier.UNITS).value = bacnet.enum.EngineeringUnits.NO_UNITS;
    }
    addProperty(propertyId, typeId = undefined) {
        propertyId = parseInt(propertyId);
        if (this.dynamicProperties.includes(propertyId)) {
            const propertyName = Util.getPropName(propertyId);
            throw new Error(`Property ${propertyName} is generated on-the-fly and cannot be set.`);
        }
        return (this.properties[propertyId] ||
            (this.properties[propertyId] = new BACnetObjectProperty(this, propertyId, typeId)));
    }
    addPropertyBulk(propList) {
        Object.keys(propList).forEach(p => {
            this.addProperty(p).value = propList[p];
        });
    }
    delProperty(propertyId, index = undefined) {
        if (index !== undefined) {
            delete this.properties[propertyId][index];
        }
        else {
            delete this.properties[propertyId];
        }
    }
    getProperty(propertyId) {
        propertyId = parseInt(propertyId);
        switch (propertyId) {
            case bacnet.enum.PropertyIdentifier.OBJECT_IDENTIFIER: {
                const prop = new BACnetObjectProperty(this, propertyId, undefined, true);
                prop._value = {
                    typeId: this.getProperty(bacnet.enum.PropertyIdentifier.OBJECT_TYPE).value,
                    instance: this.instance,
                };
                return prop;
            }
            case bacnet.enum.PropertyIdentifier.PROPERTY_LIST: {
                const ignoreProps = [
                    bacnet.enum.PropertyIdentifier.OBJECT_NAME,
                    bacnet.enum.PropertyIdentifier.OBJECT_TYPE,
                    bacnet.enum.PropertyIdentifier.OBJECT_IDENTIFIER,
                    bacnet.enum.PropertyIdentifier.PROPERTY_LIST,
                ];
                const prop = new BACnetObjectProperty(this, propertyId, undefined, true);
                const propertyList = this.getAllPropertyIds();
                prop._value = propertyList.filter(p => !ignoreProps.includes(p));
                const selfTypeId = this.getProperty(bacnet.enum.PropertyIdentifier.OBJECT_TYPE).value;
                if (MandatoryProperties[selfTypeId]) {
                    const missingProperties = MandatoryProperties[selfTypeId].filter(p => !prop._value.includes(p));
                    if (missingProperties.length > 0) {
                        const selfName = this.getProperty(bacnet.enum.PropertyIdentifier.OBJECT_NAME).value;
                        const missingPropertyNames = missingProperties.map(p => Util.getPropName(p));
                        logger.error(`Object #${this.instance}("${selfName}") is missing these mandatory properties: %o`, missingPropertyNames);
                    }
                }
                else {
                    const typeName = Util.getEnumName(bacnet.enum.ObjectType, selfTypeId);
                    logger.error(`TODO: No mandatory properties have been defined for the object type ${typeName}`);
                }
                return prop;
            }
            case bacnet.enum.PropertyIdentifier.OBJECT_LIST: {
                let objectList = [];
                Object.keys(this.objects).forEach(objType => {
                    const objectsOfType = this.objects[objType];
                    Object.keys(objectsOfType).forEach(objectInstance => {
                        const obj = objectsOfType[objectInstance];
                        objectList.push({
                            typeId: obj.getProperty(bacnet.enum.PropertyIdentifier.OBJECT_TYPE).value,
                            instance: obj.instance,
                        });
                    });
                });
                const prop = new BACnetObjectProperty(this, propertyId, undefined, true);
                prop._value = objectList;
                return prop;
            }
            case bacnet.enum.PropertyIdentifier.PROTOCOL_OBJECT_TYPES_SUPPORTED: {
                let typeList = {};
                Object.keys(this.objects).forEach(objType => {
                    const objectsOfType = this.objects[objType];
                    Object.keys(objectsOfType).forEach(objectInstance => {
                        const obj = objectsOfType[objectInstance];
                        const type = obj.getProperty(bacnet.enum.PropertyIdentifier.OBJECT_TYPE).value;
                        typeList[type] = true;
                    });
                });
                const prop = new BACnetObjectProperty(this, propertyId, undefined, true);
                prop._value = Object.keys(typeList).map(t => parseInt(t));
                return prop;
            }
            default:
                break;
        }
        return this.properties[propertyId];
    }
    getAllPropertyIds() {
        const propertyList = [
            ...Object.keys(this.properties),
            ...this.dynamicProperties,
        ];
        return propertyList.map(p => parseInt(p));
    }
    onPropertyChanged(property) {
        if (!this.dev)
            return;
        this.dev.onObjectPropertyChanged(this, property);
    }
    dumpProperties() {
        let fullPropList = Object.keys(this.properties).map(p => parseInt(p));
        fullPropList.push(bacnet.enum.PropertyIdentifier.PROTOCOL_OBJECT_TYPES_SUPPORTED);
        fullPropList.push(bacnet.enum.PropertyIdentifier.OBJECT_IDENTIFIER);
        fullPropList.push(bacnet.enum.PropertyIdentifier.PROPERTY_LIST);
        fullPropList.push(bacnet.enum.PropertyIdentifier.OBJECT_LIST);
        let props = {};
        fullPropList.forEach(key => {
            const property = this.getProperty(key);
            const keyName = Util.getPropName(key);
            props[keyName] = property.valueAsString();
        });
        return props;
    }
    getObject(instance, objectTypeId) {
        const typeGroup = this.objects[objectTypeId];
        if (!typeGroup)
            return undefined;
        return typeGroup[instance];
    }
}
module.exports = BACnetObject;
//# sourceMappingURL=bacnet-object.js.map