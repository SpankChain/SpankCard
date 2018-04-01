"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethUnits = require("ethereumjs-units");
const BigNumber = require("bignumber.js");
var Units;
(function (Units) {
    function convert(value, fromUnit, toUnit) {
        let stringNumber = ethUnits.convert(value.toString(), fromUnit, toUnit);
        return new BigNumber.BigNumber(stringNumber);
    }
    Units.convert = convert;
})(Units || (Units = {}));
exports.default = Units;
//# sourceMappingURL=Units.js.map