import * as BigNumber from 'bignumber.js';
declare namespace Units {
    function convert(value: number | BigNumber.BigNumber, fromUnit: string, toUnit: string): BigNumber.BigNumber;
}
export default Units;
