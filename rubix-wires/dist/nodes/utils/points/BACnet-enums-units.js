"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BACnetEnumsUnits {
    static unitType(type) {
        switch (type) {
            case 'Common Metric':
                return Object.keys(BACnetEnumsUnits.COMMON_METRIC);
            case 'Common Imperial':
                return Object.keys(BACnetEnumsUnits.COMMON_IMPERIAL);
            case 'Electrical':
                return Object.keys(BACnetEnumsUnits.Electrical);
            case 'Energy':
                return Object.keys(BACnetEnumsUnits.Energy);
            case 'Enthalpy':
                return Object.keys(BACnetEnumsUnits.Enthalpy);
            case 'Entropy':
                return Object.keys(BACnetEnumsUnits.Entropy);
            case 'Force':
                return Object.keys(BACnetEnumsUnits.Force);
            case 'Frequency':
                return Object.keys(BACnetEnumsUnits.Frequency);
            case 'Humidity':
                return Object.keys(BACnetEnumsUnits.Humidity);
            case 'Length':
                return Object.keys(BACnetEnumsUnits.Length);
            case 'Light':
                return Object.keys(BACnetEnumsUnits.Light);
            case 'Mass':
                return Object.keys(BACnetEnumsUnits.Mass);
            case 'Flow':
                return Object.keys(BACnetEnumsUnits.Flow);
            case 'Power':
                return Object.keys(BACnetEnumsUnits.Entropy);
            case 'Pressure':
                return Object.keys(BACnetEnumsUnits.Pressure);
            case 'Temperature':
                return Object.keys(BACnetEnumsUnits.Temperature);
            case 'Time':
                return Object.keys(BACnetEnumsUnits.Time);
            case 'Torque':
                return Object.keys(BACnetEnumsUnits.Torque);
            case 'Velocity':
                return Object.keys(BACnetEnumsUnits.Velocity);
            case 'Volume':
                return Object.keys(BACnetEnumsUnits.Volume);
            case 'Volumetric Flow':
                return Object.keys(BACnetEnumsUnits.VolumetricFlow);
            case 'Other':
                return Object.keys(BACnetEnumsUnits.Other);
        }
    }
}
exports.default = BACnetEnumsUnits;
BACnetEnumsUnits.unitCategory = ['Common Metric', 'Common Imperial', 'Electrical', 'Energy', 'Enthalpy', 'Entropy', 'Force', 'Frequency', 'Humidity', 'Length', 'Light', 'Mass', 'Flow', 'Power', 'Pressure', 'Temperature', 'Time', 'Torque', 'Velocity', 'Volume', 'Volumetric Flow', 'Other'].map(point => {
    return { value: point, text: point };
});
BACnetEnumsUnits.COMMON_METRIC = {
    NO_UNITS: 95,
    PERCENT: 98,
    PERCENT_RELATIVE_HUMIDITY: 29,
    DEGREES_CELSIUS: 62,
    KILOPASCALS: 54,
};
BACnetEnumsUnits.COMMON_IMPERIAL = {
    NO_UNITS: 95,
    PERCENT: 98,
    PERCENT_RELATIVE_HUMIDITY: 29,
    DEGREES_FAHRENHEIT: 64,
    POUNDS_FORCE_PER_SQUARE_INCH: 56,
};
BACnetEnumsUnits.Electrical = {
    MILLIAMPERES: 2,
    AMPERES: 3,
    AMPERES_PER_METER: 167,
    AMPERES_PER_SQUARE_METER: 168,
    AMPERE_SQUARE_METERS: 169,
    DECIBELS: 199,
    DECIBELS_MILLIVOLT: 200,
    DECIBELS_VOLT: 201,
    FARADS: 170,
    HENRYS: 171,
    OHMS: 4,
    OHM_METERS: 172,
    MILLIOHMS: 145,
    KILOHMS: 122,
    MEGOHMS: 123,
    MICROSIEMENS: 190,
    MILLISIEMENS: 202,
    SIEMENS: 173,
    SIEMENS_PER_METER: 174,
    TESLAS: 175,
    VOLTS: 5,
    MILLIVOLTS: 124,
    KILOVOLTS: 6,
    MEGAVOLTS: 7,
    VOLT_AMPERES: 8,
    KILOVOLT_AMPERES: 9,
    MEGAVOLT_AMPERES: 10,
    VOLT_AMPERES_REACTIVE: 11,
    KILOVOLT_AMPERES_REACTIVE: 12,
    MEGAVOLT_AMPERES_REACTIVE: 13,
    VOLTS_PER_DEGREE_KELVIN: 176,
    VOLTS_PER_METER: 177,
    DEGREES_PHASE: 14,
    POWER_FACTOR: 15,
    WEBERS: 178,
};
BACnetEnumsUnits.Energy = {
    JOULES: 16,
    KILOJOULES: 17,
    KILOJOULES_PER_KILOGRAM: 125,
    MEGAJOULES: 126,
    WATT_HOURS: 18,
    KILOWATT_HOURS: 19,
    MEGAWATT_HOURS: 146,
    WATT_HOURS_REACTIVE: 203,
    KILOWATT_HOURS_REACTIVE: 204,
    MEGAWATT_HOURS_REACTIVE: 205,
    BTUS: 20,
    KILO_BTUS: 147,
    MEGA_BTUS: 148,
    THERMS: 21,
    TON_HOURS: 22,
};
BACnetEnumsUnits.Enthalpy = {
    JOULES_PER_KILOGRAM_DRY_AIR: 23,
    KILOJOULES_PER_KILOGRAM_DRY_AIR: 149,
    MEGAJOULES_PER_KILOGRAM_DRY_AIR: 150,
    BTUS_PER_POUND_DRY_AIR: 24,
    BTUS_PER_POUND: 117,
};
BACnetEnumsUnits.Entropy = {
    JOULES_PER_DEGREE_KELVIN: 127,
    KILOJOULES_PER_DEGREE_KELVIN: 151,
    MEGAJOULES_PER_DEGREE_KELVIN: 152,
    JOULES_PER_KILOGRAM_DEGREE_KELVIN: 128,
};
BACnetEnumsUnits.Force = {
    NEWTON: 153,
};
BACnetEnumsUnits.Frequency = {
    CYCLES_PER_HOUR: 25,
    CYCLES_PER_MINUTE: 26,
    HERTZ: 27,
    KILOHERTZ: 129,
    MEGAHERTZ: 130,
    PER_HOUR: 131,
};
BACnetEnumsUnits.Humidity = {
    GRAMS_OF_WATER_PER_KILOGRAM_DRY_AIR: 28,
    PERCENT_RELATIVE_HUMIDITY: 29,
};
BACnetEnumsUnits.Length = {
    MICROMETERS: 194,
    MILLIMETERS: 30,
    CENTIMETERS: 118,
    KILOMETERS: 193,
    METERS: 31,
    INCHES: 32,
    FEET: 33,
};
BACnetEnumsUnits.Light = {
    CANDELAS: 179,
    CANDELAS_PER_SQUARE_METER: 180,
    WATTS_PER_SQUARE_FOOT: 34,
    WATTS_PER_SQUARE_METER: 35,
    LUMENS: 36,
    LUXES: 37,
    FOOT_CANDLES: 38,
};
BACnetEnumsUnits.Mass = {
    MILLIGRAMS: 196,
    GRAMS: 195,
    KILOGRAMS: 39,
    POUNDS_MASS: 40,
    TONS: 41,
};
BACnetEnumsUnits.Flow = {
    GRAMS_PER_SECOND: 154,
    GRAMS_PER_MINUTE: 155,
    KILOGRAMS_PER_SECOND: 42,
    KILOGRAMS_PER_MINUTE: 43,
    KILOGRAMS_PER_HOUR: 44,
    POUNDS_MASS_PER_SECOND: 119,
    POUNDS_MASS_PER_MINUTE: 45,
    POUNDS_MASS_PER_HOUR: 46,
    TONS_PER_HOUR: 156,
};
BACnetEnumsUnits.Power = {
    MILLIWATTS: 132,
    WATTS: 47,
    KILOWATTS: 48,
    MEGAWATTS: 49,
    BTUS_PER_HOUR: 50,
    KILO_BTUS_PER_HOUR: 157,
    HORSEPOWER: 51,
    TONS_REFRIGERATION: 52,
};
BACnetEnumsUnits.Pressure = {
    PASCALS: 53,
    HECTOPASCALS: 133,
    KILOPASCALS: 54,
    MILLIBARS: 134,
    BARS: 55,
    POUNDS_FORCE_PER_SQUARE_INCH: 56,
    MILLIMETERS_OF_WATER: 206,
    CENTIMETERS_OF_WATER: 57,
    INCHES_OF_WATER: 58,
    MILLIMETERS_OF_MERCURY: 59,
    CENTIMETERS_OF_MERCURY: 60,
    INCHES_OF_MERCURY: 61,
};
BACnetEnumsUnits.Temperature = {
    DEGREES_CELSIUS: 62,
    DEGREES_KELVIN: 63,
    DEGREES_KELVIN_PER_HOUR: 181,
    DEGREES_KELVIN_PER_MINUTE: 182,
    DEGREES_FAHRENHEIT: 64,
    DEGREE_DAYS_CELSIUS: 65,
    DEGREE_DAYS_FAHRENHEIT: 66,
    DELTA_DEGREES_FAHRENHEIT: 120,
    DELTA_DEGREES_KELVIN: 121,
};
BACnetEnumsUnits.Time = {
    YEARS: 67,
    MONTHS: 68,
    WEEKS: 69,
    DAYS: 70,
    HOURS: 71,
    MINUTES: 72,
    SECONDS: 73,
    HUNDREDTHS_SECONDS: 158,
    MILLISECONDS: 159,
};
BACnetEnumsUnits.Torque = {
    NEWTON_METERS: 160,
};
BACnetEnumsUnits.Velocity = {
    MILLIMETERS_PER_SECOND: 161,
    MILLIMETERS_PER_MINUTE: 162,
    METERS_PER_SECOND: 74,
    METERS_PER_MINUTE: 163,
    METERS_PER_HOUR: 164,
    KILOMETERS_PER_HOUR: 75,
    FEET_PER_SECOND: 76,
    FEET_PER_MINUTE: 77,
    MILES_PER_HOUR: 78,
};
BACnetEnumsUnits.Volume = {
    CUBIC_FEET: 79,
    CUBIC_METERS: 80,
    IMPERIAL_GALLONS: 81,
    MILLILITERS: 197,
    LITERS: 82,
    US_GALLONS: 83,
};
BACnetEnumsUnits.VolumetricFlow = {
    CUBIC_FEET_PER_SECOND: 142,
    CUBIC_FEET_PER_MINUTE: 84,
    CUBIC_FEET_PER_HOUR: 191,
    CUBIC_METERS_PER_SECOND: 85,
    CUBIC_METERS_PER_MINUTE: 165,
    CUBIC_METERS_PER_HOUR: 135,
    IMPERIAL_GALLONS_PER_MINUTE: 86,
    MILLILITERS_PER_SECOND: 198,
    LITERS_PER_SECOND: 87,
    LITERS_PER_MINUTE: 88,
    LITERS_PER_HOUR: 136,
    US_GALLONS_PER_MINUTE: 89,
    US_GALLONS_PER_HOUR: 192,
};
BACnetEnumsUnits.Other = {
    DEGREES_ANGULAR: 90,
    DEGREES_CELSIUS_PER_HOUR: 91,
    DEGREES_CELSIUS_PER_MINUTE: 92,
    DEGREES_FAHRENHEIT_PER_HOUR: 93,
    DEGREES_FAHRENHEIT_PER_MINUTE: 94,
    JOULE_SECONDS: 183,
    KILOGRAMS_PER_CUBIC_METER: 186,
    KW_HOURS_PER_SQUARE_METER: 137,
    KW_HOURS_PER_SQUARE_FOOT: 138,
    MEGAJOULES_PER_SQUARE_METER: 139,
    MEGAJOULES_PER_SQUARE_FOOT: 140,
    NO_UNITS: 95,
    NEWTON_SECONDS: 187,
    NEWTONS_PER_METER: 188,
    PARTS_PER_MILLION: 96,
    PARTS_PER_BILLION: 97,
    PERCENT: 98,
    PERCENT_OBSCURATION_PER_FOOT: 143,
    PERCENT_OBSCURATION_PER_METER: 144,
    PERCENT_PER_SECOND: 99,
    PER_MINUTE: 100,
    PER_SECOND: 101,
    PSI_PER_DEGREE_FAHRENHEIT: 102,
    RADIANS: 103,
    RADIANS_PER_SECOND: 184,
    REVOLUTIONS_PER_MINUTE: 104,
    SQUARE_METERS_PER_NEWTON: 185,
    WATTS_PER_METER_PER_DEGREE_KELVIN: 189,
    WATTS_PER_SQUARE_METER_DEGREE_KELVIN: 141,
    PER_MILLE: 207,
    GRAMS_PER_GRAM: 208,
    KILOGRAMS_PER_KILOGRAM: 209,
    GRAMS_PER_KILOGRAM: 210,
    MILLIGRAMS_PER_GRAM: 211,
    MILLIGRAMS_PER_KILOGRAM: 212,
    GRAMS_PER_MILLILITER: 213,
    GRAMS_PER_LITER: 214,
    MILLIGRAMS_PER_LITER: 215,
    MICROGRAMS_PER_LITER: 216,
    GRAMS_PER_CUBIC_METER: 217,
    MILLIGRAMS_PER_CUBIC_METER: 218,
    MICROGRAMS_PER_CUBIC_METER: 219,
    NANOGRAMS_PER_CUBIC_METER: 220,
    GRAMS_PER_CUBIC_CENTIMETER: 221,
    BECQUERELS: 222,
    MEGABECQUERELS: 224,
    GRAY: 225,
    MILLIGRAY: 226,
    MICROGRAY: 227,
    SIEVERTS: 228,
    MILLISIEVERTS: 229,
    MICROSIEVERTS: 230,
    MICROSIEVERTS_PER_HOUR: 231,
    DECIBELS_A: 232,
    NEPHELOMETRIC_TURBIDITY_UNIT: 233,
    PH: 234,
    GRAMS_PER_SQUARE_METER: 235,
    MINUTES_PER_DEGREE_KELVIN: 236,
};
//# sourceMappingURL=BACnet-enums-units.js.map