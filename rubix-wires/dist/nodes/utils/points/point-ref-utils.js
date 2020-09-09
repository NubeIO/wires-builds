"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let TAGNAME = {
    CHILLER: 'Chiller',
    CHWP: 'CHWP',
    PlantChilledWater: 'Plant-Chilled Water',
    BuildingInfo: 'Building Info',
    HeatExchanger: 'Heat Exchanger',
    CoolingTower: 'Cooling Tower',
    CWP: 'CWP',
    PlantCoolingTower: 'Plant-Cooling Tower',
    Boiler: 'Boiler',
    HWP: 'HWP',
    BoilerPlant: 'Boiler Plant',
    FloorControl: 'Floor Control',
    AHU_VAV: 'AHU-VAV',
    AHU_CAV: 'AHU_CAV',
    FCU: 'FCU',
    FTU: 'FTU',
    PAC_HotWaterReheat: 'PAC - Hot Water Reheat',
    PAC_ReverseCycle: 'PAC - Reverse Cycle',
    PAC_ElectricReheat: 'PAC - Electric Reheat',
    PAC_Electric_Reheat_WaterCooled: 'PAC - Electric Reheat - Water Cooled',
    OutsideAirFan: 'Outside Air Fan',
    SupplyAirFan: 'Supply Air Fan',
    ReturnAirFan: 'ReturnAirFan',
    AHUReturnAirFan: 'AHU Return Air Fan',
    CarParkSupplyAirFan: 'CarPark Supply Air Fan',
    CarParkExhaustAirFan: 'CarPark Exhaust Air Fan',
    ToiletExhaustAirFan: 'Toilet Exhaust Air Fan',
    KitchenExhaustAirFan: 'Kitchen Exhaust Air Fan',
    ExhaustAirFan: 'Exhaust Air Fan',
    GeneralExhaustAirFan: 'General Exhaust Air Fan',
    VAV: 'VAV',
    Power_SubMeter: 'Power_SubMeter',
    PowerSiteMeter: 'Power Site Meter',
    Gas_SubMeter: 'Gas sub-Meter',
    Gas_SiteMeter: 'Gas Site Meter',
    Water_subMeter: 'Water sub-Meter',
    Water_SiteMeter: 'Water Site Meter',
};
class tagRefs {
    static tagType(type) {
        switch (type) {
            case TAGNAME.CHILLER:
                return tagRefs.CHILLER;
            case TAGNAME.CHWP:
                return tagRefs.CHWP;
            case TAGNAME.PlantChilledWater:
                return tagRefs.PlantChilledWater;
            case TAGNAME.BuildingInfo:
                return tagRefs.BuildingInfo;
            case TAGNAME.HeatExchanger:
                return tagRefs.HeatExchanger;
            case TAGNAME.CoolingTower:
                return tagRefs.CoolingTower;
            case TAGNAME.CWP:
                return tagRefs.CWP;
            case TAGNAME.PlantCoolingTower:
                return tagRefs.PlantCoolingTower;
            case TAGNAME.Boiler:
                return tagRefs.Boiler;
            case TAGNAME.HWP:
                return tagRefs.HWP;
            case TAGNAME.BoilerPlant:
                return tagRefs.BoilerPlant;
            case TAGNAME.FloorControl:
                return tagRefs.FloorControl;
            case TAGNAME.AHU_VAV:
                return tagRefs.AHU_VAV;
            case TAGNAME.AHU_CAV:
                return tagRefs.AHU_CAV;
            case TAGNAME.FCU:
                return tagRefs.FCU;
            case TAGNAME.FTU:
                return tagRefs.FTU;
            case TAGNAME.PAC_HotWaterReheat:
                return tagRefs.PAC_HotWaterReheat;
            case TAGNAME.PAC_ReverseCycle:
                return tagRefs.PAC_ReverseCycle;
            case TAGNAME.PAC_ElectricReheat:
                return tagRefs.PAC_ElectricReheat;
            case TAGNAME.PAC_Electric_Reheat_WaterCooled:
                return tagRefs.PAC_Electric_Reheat_WaterCooled;
            case TAGNAME.OutsideAirFan:
                return tagRefs.OutsideAirFan;
            case TAGNAME.SupplyAirFan:
                return tagRefs.SupplyAirFan;
            case TAGNAME.ReturnAirFan:
                return tagRefs.ReturnAirFan;
            case TAGNAME.AHUReturnAirFan:
                return tagRefs.AHUReturnAirFan;
            case TAGNAME.CarParkSupplyAirFan:
                return tagRefs.CarParkSupplyAirFan;
            case TAGNAME.ToiletExhaustAirFan:
                return tagRefs.ToiletExhaustAirFan;
            case TAGNAME.KitchenExhaustAirFan:
                return tagRefs.KitchenExhaustAirFan;
            case TAGNAME.ExhaustAirFan:
                return tagRefs.ExhaustAirFan;
            case TAGNAME.GeneralExhaustAirFan:
                return tagRefs.GeneralExhaustAirFan;
            case TAGNAME.VAV:
                return tagRefs.VAV;
            case TAGNAME.Power_SubMeter:
                return tagRefs.Power_SubMeter;
            case TAGNAME.PowerSiteMeter:
                return tagRefs.PowerSiteMeter;
            case TAGNAME.Gas_SubMeter:
                return tagRefs.Gas_SubMeter;
            case TAGNAME.Gas_SiteMeter:
                return tagRefs.Gas_SiteMeter;
            case TAGNAME.Water_subMeter:
                return tagRefs.Water_subMeter;
        }
    }
}
exports.default = tagRefs;
tagRefs.acronyms = {
    BMS: 'BMS',
    RTD: 'RTD',
    AHU: 'AHU',
    CW: 'CW',
    RTU: 'RTU',
    RH: 'RH',
    CHWP: 'CHWP',
    CWP: 'CWP',
    HWP: 'HWP',
    EVP: 'EVP',
    FCU: 'FCU',
    FTU: 'FTU',
    VAV: 'VAV',
    CT: 'CT',
    CTF: 'CTF',
    RT: 'RT',
    RAT: 'RAT',
    SAT: 'SAT',
    ZT: 'ZT',
    CHL: 'CHL',
    BLR: 'BLR',
    AC: 'AC',
    RAC: 'RAC',
    EVAP: 'EVAP',
    HVAC: 'HVAC',
    HLI: 'HLI',
    BTU: 'BTU',
    CMD: 'CMD',
    REM: 'REM',
    SYS: 'SYS',
    RV: 'RV',
    SOL: 'SOL',
    DX: 'DX',
    BACnet: 'BACnet',
    LoRa: 'LoRa',
    KNX: 'KNX',
    LoRaWAN: 'LoRaWAN',
    Modbus: 'Modbus',
    LON: 'LON',
    N2: 'N2',
    SP: 'SP',
    SETP: 'SETP',
    LIQ: 'LIQ',
    PMP: 'PMP',
    TEMP: 'TEMP',
    TMP: 'TMP',
    PRESS: 'PRESS',
    EEV: 'EEV',
    DISCH: 'DISCH',
};
tagRefs.tagCategory = Object.values(TAGNAME).map(point => {
    return { value: point, text: point };
});
tagRefs.CHILLER = {
    'Chiller S/S': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['run', 'cmd', 'chilled', 'chiller'],
    },
    'Chiller Status': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['run', 'sensor', 'chilled', 'chiller'],
    },
    'Chiller Fault': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fault', 'sensor', 'chilled', 'chiller'],
    },
    'Load': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['load', 'sensor', 'chilled', 'chiller'],
    },
    'Chilled Water Supply Temperature': {
        kind: 'number',
        unit: 'Temperature',
        equipType: '',
        tags: ['water', 'temp', 'sensor', 'supply', 'chilled', 'chiller'],
    },
    'Chilled Water Supply Temperature Setpoint': {
        kind: 'number',
        unit: 'Temperature',
        equipType: '',
        tags: ['water', 'temp', 'sp', 'supply', 'chilled', 'chiller'],
    },
    'Chilled Water Return Temperature': {
        kind: 'number',
        unit: 'Temperature',
        equipType: '',
        tags: ['water', 'temp', 'sensor', 'return', 'chilled', 'chiller'],
    },
    'Condenser Water Supply Temperature': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['water', 'temp', 'sensor', 'supply', 'condenser', 'chiller'],
    },
    'Condenser Water Return Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'temp', 'sensor', 'return', 'condenser', 'chiller'],
    },
};
tagRefs.CHWP = {
    'Chilled Water Pump S/S': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['run', 'cmd', 'chilled', 'pump'],
    },
    'Chilled Water Pump Status': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['run', 'sensor', 'chilled', 'pump'],
    },
    'Chilled Water Pump Fault': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fault', 'sensor', 'chilled', 'pump'],
    },
    'Chilled Water Pump Differential Pressure': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'pressure', 'sensor', 'differential', 'chilled', 'pump'],
    },
    'Chilled Water Pump Differential Pressure Setpoint': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'pressure', 'sp', 'differential', 'chilled', 'pump'],
    },
    'Chilled Water Flow': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['water', 'flow', 'sensor', 'chilled', 'pump'],
    },
    'Chilled Water Flow Setpoint': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['water', 'flow', 'sp', 'chilled', 'pump'],
    },
    'Chilled Water Pump Speed': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['speed', 'cmd', 'chilled', 'pump'],
    },
};
tagRefs.PlantChilledWater = {
    'Common Chilled Water Supply Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'temp', 'sensor', 'supply', 'chilled', 'common'],
    },
    'Common Chilled Water Return Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'temp', 'sensor', 'return', 'chilled', 'common'],
    },
    'Common Chilled Water Differential Pressure': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'pressure', 'sensor', 'differential', 'chilled', 'common'],
    },
    'Common Chilled Water Bypass Valve': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'valve', 'bypass', 'cmd', 'chilled', 'common'],
    },
    'Common Chilled Water Differential Pressure Setpoint': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'pressure', 'sp', 'differential', 'chilled', 'common'],
    },
};
tagRefs.BuildingInfo = {
    'Outside Air Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'outside', 'dryBulb/wetBulb', 'buildingInfo'],
    },
    'Outside Air Enthalpy': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'enthalpy', 'sensor', 'outside', 'buildingInfo'],
    },
    'Outside Air Humidity': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'humidity', 'sensor', 'outside', 'buildingInfo'],
    },
};
tagRefs.HeatExchanger = {
    'Primary Supply Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'temp', 'sensor', 'supply', 'hot', 'primaryLoop', 'heatExchanger'],
    },
    'Primary Return Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'temp', 'sensor', 'return', 'hot', 'primaryLoop', 'heatExchanger'],
    },
    'Primary Loop Valve': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'cmd', 'hot', 'primaryLoop', 'heatExchanger'],
    },
    'Secondary Supply Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'temp', 'sensor', 'supply', 'hot', 'secondaryLoop', 'heatExchanger'],
    },
    'Secondary Return Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'temp', 'sensor', 'return', 'hot', 'secondaryLoop', 'heatExchanger'],
    },
    'Secondary Loop Valve': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'cmd', 'hot', 'secondaryLoop', 'heatExchanger'],
    },
};
tagRefs.CoolingTower = {
    'Cooling Tower S/S': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'cmd', 'condenser', 'coolingTower'],
    },
    'Cooling Tower Status': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'sensor', 'condenser', 'coolingTower'],
    },
    'Cooling Tower Fault': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'fault', 'sensor', 'condenser', 'coolingTower'],
    },
    'Cooling Tower Fan Speed': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['fan', 'speed', 'cmd', 'condenser', 'coolingTower'],
    },
    'Condenser Water Supply Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'temp', 'sensor', 'supply', 'condenser', 'coolingTower'],
    },
    'Condenser Water Supply Temperature Setpoint': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'temp', 'sp', 'supply', 'condenser', 'coolingTower'],
    },
    'Condenser Water Return Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'temp', 'sensor', 'return', 'condenser', 'coolingTower'],
    },
};
tagRefs.CWP = {
    'Condenser Water Pump S/S': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['run', 'cmd', 'condenser', 'pump'],
    },
    'Condenser Water Pump Status': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['run', 'sensor', 'condenser', 'pump'],
    },
    'Condenser Water Pump Fault': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fault', 'sensor', 'condenser', 'pump'],
    },
    'Condenser Water Pump Differential Pressure': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'pressure', 'sensor', 'differential', 'condenser', 'pump'],
    },
    'Condenser Water Pump Differential Pressure Setpoint': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'pressure', 'sp', 'differential', 'condenser', 'pump'],
    },
    'Condenser Water Flow': {
        kind: '',
        unit: '',
        equipType: '',
        tags: [''],
    },
    'Condenser Water Pump Speed': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['speed', 'cmd', 'condenser', 'pump'],
    },
};
tagRefs.PlantCoolingTower = {
    'Common Condenser Water Supply Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'temp', 'sensor', 'supply', 'condenser', 'common'],
    },
    'Common Condenser Pressure Diff': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'pressure', 'sensor', 'differential', 'condenser', 'common'],
    },
    'Common Bypass Valve': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'valve', 'bypass', 'cmd', 'condenser', 'common'],
    },
    'Common Condenser Water Return Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'temp', 'sensor', 'return', 'condenser', 'common'],
    },
};
tagRefs.Boiler = {
    'Boiler S/S': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['run', 'cmd', 'hot', 'boiler'],
    },
    'Boiler Status': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['run', 'sensor', 'hot', 'boiler'],
    },
    'Boiler Fault': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fault', 'sensor', 'hot', 'boiler'],
    },
    'Hot Water Supply Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'temp', 'sensor', 'supply', 'hot', 'boiler'],
    },
    'Hot Water Supply Temperature Setpoint': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'temp', 'sp', 'supply', 'hot', 'boiler'],
    },
    'Hot Water Return Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'temp', 'sensor', 'return', 'hot', 'boiler'],
    },
};
tagRefs.HWP = {
    'Hot Water Pump S/S': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['run', 'cmd', 'hot', 'pump'],
    },
    'Hot Water Pump Status': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['run', 'sensor', 'hot', 'pump'],
    },
    'Hot Water Pump Fault': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fault', 'sensor', 'hot', 'pump'],
    },
    'Hot Water Pump Differential Pressure': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'pressure', 'sensor', 'differential', 'hot', 'pump'],
    },
    'Hot Water Pump Differential Pressure Setpoint': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'pressure', 'sp', 'differential', 'hot', 'pump'],
    },
    'Hot Water Pump Speed': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['speed', 'cmd', 'hot', 'pump'],
    },
};
tagRefs.BoilerPlant = {
    'Common Hot Water Supply Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'temp', 'sensor', 'supply', 'hot', 'common'],
    },
    'Common Hot Water Return Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'temp', 'sensor', 'return', 'hot', 'common'],
    },
};
tagRefs.FloorControl = {
    'Floor Occupancy': {
        kind: 'boolean',
        unit: '',
        equipType: '',
        tags: ['run', 'cmd', 'occupied', 'floor'],
    },
    'After Hours Active Time': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['run', 'cmd', 'afterHour', 'activeTime', 'floor'],
    },
    'Zone Occupancy': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['run', 'cmd', 'occupied', 'zone', 'floor'],
    },
    'Zone After Hours Active Time': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['run', 'cmd', 'afterHour', 'activeTime', 'zone', 'floor'],
    },
    'After Hours ElapsedTime': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['afterHour', 'floor'],
    },
    'AH Enable': {
        kind: 'boolean',
        unit: '',
        equipType: '',
        tags: ['cmd', 'afterHour', 'ahuRef', 'floor'],
    },
    'VAV Enable': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['enable', 'cmd', 'vav', 'floor'],
    },
    'Return Air Damper': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['air', 'cmd', 'return', 'common', 'damper', 'floor'],
    },
    'Supply Air Damper': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['air', 'cmd', 'supply', 'common', 'damper', 'floor'],
    },
    'Isolation Air Damper': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['air', 'cmd', 'isolation', 'damper', 'floor'],
    },
    'Zone Temperature Setpoint': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sp', 'zone', 'floor'],
    },
};
tagRefs.AHU_VAV = {
    'AHU Fan S/S': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'cmd', 'supply', 'ahu'],
    },
    'AHU Fan Status': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'sensor', 'supply', 'ahu'],
    },
    'AHU Fan Fault': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'fault', 'sensor', 'supply', 'ahu'],
    },
    'AHU Fan Speed': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['fan', 'speed', 'cmd', 'supply', 'ahu'],
    },
    'Supply Air Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'supply', 'ahu'],
    },
    'Supply Air Temperature Setpoint': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sp', 'supply', 'ahu'],
    },
    'Supply Air Static Pressure': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'pressure', 'sensor', 'supply', 'ahu'],
    },
    'Supply Air Static Pressure Setpoint': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'pressure', 'sp', 'supply', 'ahu'],
    },
    'Supply Air Flow': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['air', 'flow', 'sensor', 'supply', 'ahu'],
    },
    'Outside/Return/Room Air Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'outside/return', 'ahu'],
    },
    'Return/Room Air Temperature Setpoint': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sp', 'return', 'ahu'],
    },
    'Supply/Return/Room Air Humidity': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'humidity', 'sensor', 'supply/return', 'ahu'],
    },
    'Outside Air Relative Humidity': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['air', 'humidity', 'sensor', 'outside', 'ahu'],
    },
    'Cooling Coil Valve Control': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'valve', 'cmd', 'chilled', 'ahu'],
    },
    'Heating Coil Valve Control': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'valve', 'cmd', 'hot', 'ahu'],
    },
    'Air Off Coil Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'offCoil', 'hot/cold', 'ahu'],
    },
    'Outside Air Damper Control': {
        kind: 'number/boolean',
        unit: '',
        equipType: '',
        tags: ['air', 'damper', 'cmd', 'outside', 'ahu'],
    },
    'Mix Air Temperature': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'mix', 'ahu'],
    },
    'Minimum Outside Air Damper Control': {
        kind: 'number/boolean',
        unit: '',
        equipType: '',
        tags: ['air', 'damper', 'cmd', 'outside', 'minimum', 'ahu'],
    },
    'Minimum Outside Air Damper Feedback': {
        kind: 'number/boolean',
        unit: '',
        equipType: '',
        tags: ['air', 'damper', 'sensor', 'outside', 'minimum', 'ahu'],
    },
    'Return Air Damper Control': {
        kind: 'number/boolean',
        unit: '',
        equipType: '',
        tags: ['air', 'damper', 'cmd', 'return', 'ahu'],
    },
    'Exhaust Air Damper': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['air', 'damper', 'cmd', 'exhaust', 'ahu'],
    },
    'RACO2': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['air', 'co2', 'sensor', 'return', 'ahu'],
    },
    'Electric Duct Heater S/S': {
        kind: 'boolean',
        unit: '',
        equipType: '',
        tags: ['edh', 'run', 'cmd', 'ahu'],
    },
    'Electric Duct Heater Status': {
        kind: 'boolean',
        unit: '',
        equipType: '',
        tags: ['edh', 'run', 'sensor', 'ahu'],
    },
    'Dew Point': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['dewPoint', 'sensor', 'ahu'],
    },
    'Dew Point Setpoint': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['dewPoint', 'sp', 'ahu'],
    },
    'Filter Differential Pressure': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['pressure', 'sensor', 'filter', 'delta', 'ahu'],
    },
    'Filter Differential Pressure Setpoint': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['pressure', 'sp', 'filter', 'delta', 'ahu'],
    },
    'Filter Status': {
        kind: 'number/boolean',
        unit: '',
        equipType: '',
        tags: ['fault', 'sensor', 'filter', 'ahu'],
    },
};
tagRefs.AHU_CAV = {
    'AHU Fan S/S': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'cmd', 'supply', 'ahu'],
    },
    'AHU Fan Status': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'sensor', 'supply', 'ahu'],
    },
    'AHU Fan Fault': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'fault', 'sensor', 'supply', 'ahu'],
    },
    'Speed': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['fan', 'speed', 'sensor', 'supply', 'ahu'],
    },
    'Supply Air Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'supply', 'ahu'],
    },
    'Supply Air Temperature Setpoint': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sp', 'supply', 'ahu'],
    },
    'Return Air Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'return', 'ahu'],
    },
    'Room Air Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'zone', 'ahu'],
    },
    'Outside Air Temperature': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'outside', 'ahu'],
    },
    'Mix Air Temperature': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'mix', 'ahu'],
    },
    'Return Air Temperature Setpoint': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sp', 'return', 'ahu'],
    },
    'Room Air Temperature Setpoint': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sp', 'zone', 'ahu'],
    },
    'Return Air Humidity': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'humidity', 'sensor', 'return', 'ahu'],
    },
    'Room Air Humidity': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'humidity', 'sensor', 'zone', 'ahu'],
    },
    'Outside Air Relative Humidity': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['air', 'humidity', 'sensor', 'outside', 'ahu'],
    },
    'Cooling Coil Valve Control': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'valve', 'cmd', 'chilled', 'ahu'],
    },
    'Heating Coil Valve Control': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'valve', 'cmd', 'hot', 'ahu'],
    },
    'Air Off Coil Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'offCoil', 'hot/cold', 'ahu'],
    },
    'Outside Air Damper Control': {
        kind: 'number/boolean',
        unit: '',
        equipType: '',
        tags: ['air', 'damper', 'cmd', 'outside', 'ahu'],
    },
    'Minimum Outside Air Damper Control': {
        kind: 'number/boolean',
        unit: '',
        equipType: '',
        tags: ['air', 'damper', 'cmd', 'outside', 'minimum', 'ahu'],
    },
    'Minimum Outside Air Damper Feedback': {
        kind: 'number/boolean',
        unit: '',
        equipType: '',
        tags: ['air', 'damper', 'sensor', 'outside', 'minimum', 'ahu'],
    },
    'Exhaust Air Damper': {
        kind: 'number/boolean',
        unit: '',
        equipType: '',
        tags: ['air', 'damper', 'cmd', 'exhaust', 'ahu'],
    },
    'RACO2': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['air', 'co2', 'sensor', 'return', 'ahu'],
    },
    'Electric Duct Heater S/S': {
        kind: 'boolean',
        unit: '',
        equipType: '',
        tags: ['edh', 'run', 'cmd', 'ahu'],
    },
    'Electric Duct Heater Status': {
        kind: 'boolean',
        unit: '',
        equipType: '',
        tags: ['edh', 'run', 'sensor', 'ahu'],
    },
    'Dew Point': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['dewPoint', 'sensor', 'ahu'],
    },
    'Dew Point Setpoint': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['dewPoint', 'sp', 'ahu'],
    },
    'Filter Differential Pressure/Status': {
        kind: 'number/boolean',
        unit: '',
        equipType: '',
        tags: ['air', 'pressure', 'sensor', 'filter', 'ahu'],
    },
};
tagRefs.FCU = {
    'FCU Fan S/S': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'cmd', 'fcu'],
    },
    'FCU Fan Status': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'sensor', 'fcu'],
    },
    'FCU Fan Speed': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['fan', 'speed', 'sensor', 'supply', 'fcu'],
    },
    'FCU Fan Fault': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'fault', 'sensor', 'fcu'],
    },
    'Supply Air Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'supply', 'fcu'],
    },
    'Supply Air Temperature Setpoint': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sp', 'supply', 'fcu'],
    },
    'Return/Room Air Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'return/zone', 'fcu'],
    },
    'Return/Room Air Temperature Setpoint': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sp', 'return/zone', 'fcu'],
    },
    'Return/Room Air Humidity': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'humidity', 'sensor', 'return/zone', 'fcu'],
    },
    'Cooling Coil Valve Control': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'valve', 'cmd', 'chilled', 'fcu'],
    },
    'Heating Coil Valve Control': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'valve', 'cmd', 'hot', 'fcu'],
    },
    'Air Off Coil Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'offCoil', 'hot/cold', 'fcu'],
    },
    'Outside Air Damper Control': {
        kind: 'number/boolean',
        unit: '',
        equipType: '',
        tags: ['air', 'damper', 'cmd', 'outside', 'fcu'],
    },
    'Filter Differential Pressure/Status': {
        kind: 'number/boolean',
        unit: '',
        equipType: '',
        tags: ['air', 'pressure', 'sensor', 'filter', 'fcu'],
    },
};
tagRefs.FTU = {
    'FTU Fan S/S': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['fan', 'run', 'cmd', 'ftu'],
    },
    'Supply Air Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'supply', 'ftu'],
    },
    'Return/Room Air Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'return/zone', 'ftu'],
    },
    'Heating Coil Valve Control': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'valve', 'cmd', 'hot', 'ftu'],
    },
    'Airflow': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'flow', 'sensor', 'ftu'],
    },
    'Damper Feedback': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['air', 'damper', 'sensor', 'ftu'],
    },
};
tagRefs.PAC_HotWaterReheat = {
    'PAC Fan S/S': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'cmd', 'pac'],
    },
    'PAC Fan Status': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'sensor', 'pac'],
    },
    'PAC Fan Fault': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'fault', 'sensor', 'pac'],
    },
    'Supply Air Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'supply', 'pac'],
    },
    'Return/Room Air Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'return/zone', 'pac'],
    },
    'Return/Room Air Temperature Setpoint': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sp', 'return/zone', 'pac'],
    },
    'Return/Room Air Humidity': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'humidity', 'sensor', 'return/zone', 'pac'],
    },
    'Compressor S/S': {
        kind: 'boolean',
        unit: '',
        equipType: '',
        tags: ['refrig', 'run', 'cmd', 'pac'],
    },
    'Heating Coil Valve Control': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['water', 'valve', 'cmd', 'hot', 'pac'],
    },
    'Air Off Coil Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'offCoil', 'hot/cold', 'pac'],
    },
    'Outside Air Damper Control': {
        kind: 'number/boolean',
        unit: '',
        equipType: '',
        tags: ['air', 'damper', 'cmd', 'outside', 'pac'],
    },
    'Filter Differential Pressure/Status': {
        kind: 'number/boolean',
        unit: '',
        equipType: '',
        tags: ['air', 'pressure', 'sensor', 'filter', 'pac'],
    },
};
tagRefs.PAC_ReverseCycle = {
    'PAC Fan S/S': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'cmd', 'pac'],
    },
    'PAC Fan Status': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'sensor', 'pac'],
    },
    'PAC Fan Fault': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'fault', 'sensor', 'pac'],
    },
    'Supply Air Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'supply', 'pac'],
    },
    'Return/Room Air Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'return/zone', 'pac'],
    },
    'Return/Room Air Temperature Setpoint': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sp', 'return/zone', 'pac'],
    },
    'Return/Room Air Humidity': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'humidity', 'sensor', 'return/zone', 'pac'],
    },
    'Compressor S/S': {
        kind: 'boolean',
        unit: '',
        equipType: '',
        tags: ['refrig', 'run', 'cmd', 'reverse', 'pac'],
    },
    'Reverse Valve Control': {
        kind: 'boolean',
        unit: '',
        equipType: '',
        tags: ['valve', 'run', 'cmd', 'reverse', 'pac'],
    },
    'Air Off Coil Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'offCoil', 'hot/cold', 'pac'],
    },
    'Outside Air Damper Control': {
        kind: 'number/boolean',
        unit: '',
        equipType: '',
        tags: ['air', 'damper', 'cmd', 'outside', 'pac'],
    },
    'Filter Differential Pressure/Status': {
        kind: 'number/boolean',
        unit: '',
        equipType: '',
        tags: ['air', 'pressure', 'sensor', 'filter', 'pac'],
    },
};
tagRefs.PAC_ElectricReheat = {
    'PAC Fan S/S': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'cmd', 'pac'],
    },
    'PAC Fan Status': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'sensor', 'pac'],
    },
    'PAC Fan Fault': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'fault', 'sensor', 'pac'],
    },
    'Supply Air Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'supply', 'pac'],
    },
    'Return/Room Air Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'return/zone', 'pac'],
    },
    'Return/Room Air Temperature Setpoint': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sp', 'return/zone', 'pac'],
    },
    'Return/Room Air Humidity': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'humidity', 'sensor', 'return/zone', 'pac'],
    },
    'Compressor S/S': {
        kind: 'boolean',
        unit: '',
        equipType: '',
        tags: ['refrig', 'run', 'cmd', 'pac'],
    },
    'Electric Duct Heater S/S': {
        kind: 'boolean',
        unit: '',
        equipType: '',
        tags: ['edh', 'run', 'cmd', 'pac'],
    },
    'Air Off Coil Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'offCoil', 'hot/cold', 'pac'],
    },
    'Outside Air Damper Control': {
        kind: 'number/boolean',
        unit: '',
        equipType: '',
        tags: ['air', 'damper', 'cmd', 'outside', 'pac'],
    },
    'Filter Differential Pressure/Status': {
        kind: 'number/boolean',
        unit: '',
        equipType: '',
        tags: ['air', 'pressure', 'sensor', 'filter', 'pac'],
    },
};
tagRefs.PAC_Electric_Reheat_WaterCooled = {
    'PAC Fan S/S': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'cmd', 'pac'],
    },
    'PAC Fan Status': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'sensor', 'pac'],
    },
    'PAC Fan Fault': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'fault', 'sensor', 'pac'],
    },
    'Supply Air Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'supply', 'pac'],
    },
    'Return/Room Air Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'return/zone', 'pac'],
    },
    'Return/Room Air Temperature Setpoint': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sp', 'return/zone', 'pac'],
    },
    'Return/Room Air Humidity': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'humidity', 'sensor', 'return/zone', 'pac'],
    },
    'Compressor S/S': {
        kind: 'boolean',
        unit: '',
        equipType: '',
        tags: ['refrig', 'run', 'cmd', 'pac'],
    },
    'Electric Duct Heater S/S': {
        kind: 'boolean',
        unit: '',
        equipType: '',
        tags: ['edh', 'run', 'cmd', 'pac'],
    },
    'Condenser Water Call': {
        kind: 'boolean',
        unit: '',
        equipType: '',
        tags: ['run', 'cmd', 'condenser', 'pac'],
    },
    'Air Off Coil Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'offCoil', 'hot/cold', 'pac'],
    },
    'Outside Air Damper Control': {
        kind: 'number/boolean',
        unit: '',
        equipType: '',
        tags: ['air', 'damper', 'cmd', 'outside', 'pac'],
    },
    'Filter Differential Pressure/Status': {
        kind: 'number/boolean',
        unit: '',
        equipType: '',
        tags: ['air', 'pressure', 'sensor', 'filter', 'pac'],
    },
};
tagRefs.OutsideAirFan = {
    'Outside Air Fan S/S': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'cmd', 'outside', 'oaf'],
    },
    'Outside Air Fan Status': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'sensor', 'outside', 'oaf'],
    },
    'Outside Air Fan Fault': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'fault', 'sensor', 'outside', 'oaf'],
    },
    'Outside Air Fan Speed': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['fan', 'speed', 'cmd', 'outside', 'oaf'],
    },
    'Outside Air Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'outside', 'oaf'],
    },
    'Outside Air Humidity': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'humidity', 'sensor', 'outside', 'oaf'],
    },
    'Outside Air Flow': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'flow', 'sensor', 'return', 'oaf'],
    },
    'Outside Air Static Pressure': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'pressure', 'sensor', 'outside', 'oaf'],
    },
    'Outside Air Static Pressure Setpoint': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'pressure', 'sp', 'outside', 'oaf'],
    },
};
tagRefs.SupplyAirFan = {
    'Supply Air Fan S/S': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'cmd', 'supply', 'saf'],
    },
    'Supply Air Fan Status': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'sensor', 'supply', 'saf'],
    },
    'Supply Air Fan Fault': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'fault', 'sensor', 'supply', 'saf'],
    },
    'Supply Air Fan Speed': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['fan', 'speed', 'cmd', 'supply', 'saf'],
    },
    'Supply Air Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'supply', 'saf'],
    },
    'Supply Air Flow': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'flow', 'sensor', 'supply', 'saf'],
    },
    'Supply Air Humidity': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'humidity', 'sensor', 'supply', 'saf'],
    },
    'Supply Air Static Pressure': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'pressure', 'sensor', 'supply', 'saf'],
    },
    'Supply Air Static Pressure Setpoint': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'pressure', 'sp', 'supply', 'saf'],
    },
};
tagRefs.ReturnAirFan = {
    'Return Air Fan S/S': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'cmd', 'return', 'raf'],
    },
    'Return Air Fan Status': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'sensor', 'return', 'raf'],
    },
    'Return Air Fan Fault': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'fault', 'sensor', 'return', 'raf'],
    },
    'Return Air Fan Speed': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['fan', 'speed', 'cmd', 'return', 'raf'],
    },
    'Return Air Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'return', 'raf'],
    },
    'Return Air Humidity': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'humidity', 'sensor', 'return', 'raf'],
    },
    'Return Air Flow': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'flow', 'sensor', 'return', 'raf'],
    },
    'Return Air Static Pressure': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'pressure', 'sensor', 'return', 'raf'],
    },
    'Return Air Enthalpy': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['air', 'enthalpy', 'sensor', 'return', 'raf'],
    },
    'Return Air Suction Pressure': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'pressure', 'sensor', 'return', 'raf'],
    },
    'Return Air CO2': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'co2', 'sensor', 'return', 'raf'],
    },
    'Return Air Static Pressure Setpoint': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'pressure', 'sp', 'return', 'raf'],
    },
};
tagRefs.AHUReturnAirFan = {
    'AHU Return Air Fan S/S': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'cmd', 'return', 'ahu'],
    },
    'AHU Return Air Fan Status': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'sensor', 'return', 'ahu'],
    },
    'AHU Return Air Fan Fault': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'fault', 'sensor', 'return', 'ahu'],
    },
    'AHU Return Air Fan Speed': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['fan', 'speed', 'cmd', 'return', 'ahu'],
    },
    'AHU Return Air Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'return', 'ahu'],
    },
    'AHU Return Air Humidity': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'humidity', 'sensor', 'return', 'ahu'],
    },
    'AHU Return Air Static Pressure': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'pressure', 'sensor', 'return', 'ahu'],
    },
    'AHU Return Air CO2': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'co2', 'sensor', 'return', 'ahu'],
    },
    'AHU Return Air Static Pressure Setpoint': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'pressure', 'sp', 'return', 'ahu'],
    },
};
tagRefs.CarParkSupplyAirFan = {
    'CarPark Supply Air Fan S/S': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'cmd', 'supply', 'carpark'],
    },
    'CarPark Supply Air Fan Status': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'sensor', 'supply', 'carpark'],
    },
    'CarPark Supply Air Fan Fault': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'fault', 'sensor', 'supply', 'carpark'],
    },
    'CarPark Supply Air Fan Speed': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['fan', 'speed', 'cmd', 'supply', 'carpark'],
    },
    'CarPark Supply Air Static Pressure': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'pressure', 'sensor', 'supply', 'carpark'],
    },
    'CarPark Supply Air Static Pressure Setpoint': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'pressure', 'sp', 'supply', 'carpark'],
    },
};
tagRefs.CarParkExhaustAirFan = {
    'CarPark Exhaust Air Fan S/S': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'cmd', 'exhaust', 'carpark'],
    },
    'CarPark Exhaust Air Fan Status': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'sensor', 'exhaust', 'carpark'],
    },
    'CarPark Exhaust Air Fan Fault': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'fault', 'sensor', 'exhaust', 'carpark'],
    },
    'CarPark Exhaust Air Fan Speed': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['fan', 'speed', 'cmd', 'exhaust', 'carpark'],
    },
    'CarPark Exhaust Air Static Pressure': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'pressure', 'sensor', 'exhaust', 'carpark'],
    },
    'CarPark Exhaust Air Static Pressure Setpoint': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'pressure', 'sp', 'exhaust', 'carpark'],
    },
    'CarPark Exhaust Carbon Monoxide': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'co', 'sensor', 'exhaust', 'carpark'],
    },
    'CarPark Exhaust Carbon Monoxide Setpoint': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'co', 'sp', 'exhaust', 'carpark'],
    },
};
tagRefs.ToiletExhaustAirFan = {
    'Toilet Exhaust Air Fan S/S': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'cmd', 'exhaust', 'toilet'],
    },
    'Toilet Exhaust Air Fan Status': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'sensor', 'exhaust', 'toilet'],
    },
    'Toilet Exhaust Air Fan Fault': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'fault', 'sensor', 'exhaust', 'toilet'],
    },
    'Toilet Exhaust Air Static Pressure': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'pressure', 'sensor', 'exhaust', 'toilet'],
    },
};
tagRefs.KitchenExhaustAirFan = {
    'Kitchen Exhaust Air Fan S/S': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'cmd', 'exhaust', 'kitchen'],
    },
    'Kitchen Exhaust Air Fan Status': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'sensor', 'exhaust', 'kitchen'],
    },
    'Kitchen Exhaust Air Fan Fault': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'fault', 'sensor', 'exhaust', 'kitchen'],
    },
    'Kitchen Exhaust Air Static Pressure': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'pressure', 'sensor', 'exhaust', 'kitchen'],
    },
};
tagRefs.ExhaustAirFan = {
    'Exhaust Air Fan S/S': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'cmd', 'exhaust'],
    },
    'Exhaust Air Fan Status': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'sensor', 'exhaust'],
    },
    'Exhaust Air Fan Fault': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'fault', 'sensor', 'exhaust'],
    },
    'Exhaust Air Static Pressure': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'pressure', 'sensor', 'exhaust'],
    },
};
tagRefs.GeneralExhaustAirFan = {
    'General Exhaust Air Fan S/S': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'cmd', 'exhaust', 'general'],
    },
    'General Exhaust Air Fan Status': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'run', 'sensor', 'exhaust', 'general'],
    },
    'General Exhaust Air Fan Fault': {
        kind: 'boolean',
        unit: '',
        equipType: 'hisTsPrecision',
        tags: ['fan', 'fault', 'sensor', 'exhaust', 'general'],
    },
    'General Exhaust Air Static Pressure': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'pressure', 'sensor', 'exhaust', 'general'],
    },
};
tagRefs.VAV = {
    'Zone/Room Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'zone', 'vav'],
    },
    'Zone/Room Temperature Setpoint': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sp', 'zone', 'vav'],
    },
    'Supply Air Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'supply', 'vav'],
    },
    'Return Air Temperature': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'temp', 'sensor', 'return', 'vav'],
    },
    'Zone/Room Relative Humidity': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'humidity', 'sensor', 'zone', 'vav'],
    },
    'Damper': {
        kind: 'number',
        unit: '%',
        equipType: '',
        tags: ['air', 'damper', 'cmd', 'vav'],
    },
    'Airflow': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'flow', 'sensor', 'vav'],
    },
    'Airflow Setpoint': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'flow', 'sp', 'vav'],
    },
    'Minimum Airflow': {
        kind: 'string',
        unit: '',
        equipType: '',
        tags: ['air', 'flow', 'sensor', 'min', 'vav'],
    },
    'Electric Duct Heater Status': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['edh', 'run', 'sensor', 'vav'],
    },
    'Electric Duct Heater S/S': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['edh', 'run', 'cmd', 'vav'],
    },
    'Terminal Load': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'sensor', 'terminalLoad', 'vav'],
    },
    'Maximum Airflow': {
        kind: 'number',
        unit: '',
        equipType: '',
        tags: ['air', 'flow', 'sensor', 'max', 'vav'],
    },
};
tagRefs.Power_SubMeter = {
    'Total Active Energy': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['elec', 'energy', 'sensor', 'active', 'exclusion', 'hisOnWrite'],
    },
    'Total Active Power': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['elec', 'power', 'sensor', 'active'],
    },
};
tagRefs.PowerSiteMeter = {
    'Total Active Energy': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['elec', 'energy', 'sensor', 'active'],
    },
    'Total Active Power': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['elec', 'power', 'sensor', 'active'],
    },
    'Energy Target': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['elec ', 'energy', 'target'],
    },
    '???': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['gas', 'sensor', 'inclusion', 'hisTotalized'],
    },
};
tagRefs.Gas_SubMeter = {
    'Total Gas Consumption': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['gas', 'sensor', 'exclusion', 'hisTotalized'],
    },
};
tagRefs.Gas_SiteMeter = {
    'Total Gas Consumption': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['gas', 'sensor', 'inclusion', 'hisTotalized'],
    },
    'Gas Target': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['gas', 'target', 'sensor', 'exclusion', 'hisTotalized'],
    },
};
tagRefs.Water_subMeter = {
    'Total Water Consumption': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['water', 'sensor', 'inclusion/exclusion', 'hisTotalized'],
    },
};
tagRefs.Water_SiteMeter = {
    'Total Water Consumption': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['water', 'sensor'],
    },
    'Water Target': {
        kind: '',
        unit: '',
        equipType: '',
        tags: ['water', 'target'],
    },
};
;
//# sourceMappingURL=point-ref-utils.js.map