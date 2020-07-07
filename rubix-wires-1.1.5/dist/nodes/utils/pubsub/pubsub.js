"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PubSub = require('pubsub-js');
const microCache = require('microcache');
const topicNetwork = {
    network: {
        all: 'network',
        modbus: 'modbus',
        bacnet: 'bacnet',
        LoRa: 'LoRa',
        LoRaWan: 'LoRaWan',
        uart: 'uart',
    },
};
const topicTransport = {
    network: {
        all: 'transport',
        serial: 'serial',
        rs485: 'rs485',
        rtu: 'rtu',
        mstp: 'mstp',
        TCP: 'TCP',
        IP: 'IP',
        UPD: 'UPD',
    },
};
const cache = new microCache();
class PubSubReplay {
    static publishCache(topic, data) {
        cache.set(topic, data);
        return PubSub.publish(topic, data);
    }
    static publish(topic, data) {
        return PubSub.publish(topic, data);
    }
    static subscribe(topic, func, replay = false) {
        return PubSub.subscribe(topic, func);
    }
    static subscribeCache(topic, func, replay = false) {
        if (replay) {
            const data = cache.get(topic);
            if (data) {
                func(topic, data);
            }
        }
        return PubSub.subscribe(topic, func);
    }
    static unsubscribe(tokenOrTopic) {
        return PubSub.unsubscribe(tokenOrTopic);
    }
    static clearAllSubscriptions() {
        return PubSub.clearAllSubscriptions();
    }
    static topicBuilder(edgeUUID, edgeId, newType, networkType, networkTransport, networkId, deviceId, pointId, pointType, networkNumber, deviceNumber, pointNumber) {
        let exampleNetwork = 'INCORRECT TOPIC SEE EXAMPLE: API_VERSION.EDGE_ID.network.NETWORK_TYPE.NETWORK_TRANSPORT.NETWORK_NUM.device.DEVICE_NUM.points.METHOD.type.TYPE_NUM.point.POINT_NUM.details';
        let apiVersionPub = 'apiV1';
        let apiVersionMqtt = 'apiV1';
        this.pubNetworkBuilder = `${apiVersionPub}.network.${networkType}.${networkTransport}.${networkNumber}`;
        this.pubDeviceBuilder = `${this.pubNetworkBuilder}.devices.device.${deviceNumber}`;
        this.pubPointBuilder = `${this.pubNetworkBuilder}.${deviceNumber}.points.type.${pointType}.point.${pointNumber}`;
        this.mqttNetworkBuilder = `${apiVersionMqtt}.network/${networkType}/${networkTransport}/${networkNumber}`;
        this.mqttDeviceBuilder = `${this.mqttNetworkBuilder}/${deviceNumber}`;
        this.mqttPointBuilder = `${this.mqttNetworkBuilder}/${deviceNumber}/points.type/${pointType}/point/${pointNumber}`;
        if (isNaN(networkNumber)) {
            return `'${networkNumber}' is not a valid network number`;
        }
        if (networkType === 'modbus') {
            if (networkTransport === 'tcp') {
                if (newType === 'network') {
                    return {
                        pub: this.pubNetworkBuilder,
                        mqtt: this.mqttNetworkBuilder,
                    };
                }
                else if (newType === 'device') {
                    return {
                        pub: this.pubDeviceBuilder,
                        mqtt: this.mqttDeviceBuilder,
                    };
                }
                else if (newType === 'point') {
                    return {
                        pub: this.pubPointBuilder,
                        mqtt: this.mqttPointBuilder,
                    };
                }
                return exampleNetwork;
            }
            if (networkTransport === 'rtu') {
                if (newType === 'network') {
                    return {
                        pub: this.pubNetworkBuilder,
                        mqtt: this.mqttNetworkBuilder,
                    };
                }
                else if (newType === 'device') {
                    return {
                        pub: this.pubDeviceBuilder,
                        mqtt: this.mqttDeviceBuilder,
                    };
                }
                else if (newType === 'point') {
                    return {
                        pub: this.pubPointBuilder,
                        mqtt: this.mqttPointBuilder,
                    };
                }
                return exampleNetwork;
            }
        }
    }
}
exports.default = PubSubReplay;
//# sourceMappingURL=pubsub.js.map