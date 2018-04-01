"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const truffle = require("truffle-contract");
var Unidirectional;
(function (Unidirectional) {
    Unidirectional.ARTIFACT = require('../contracts/Unidirectional.json');
    function isDidOpenEvent(something) {
        return something.event === 'DidOpen';
    }
    Unidirectional.isDidOpenEvent = isDidOpenEvent;
    function isDidDepositEvent(something) {
        return something.event === 'DidDeposit';
    }
    Unidirectional.isDidDepositEvent = isDidDepositEvent;
    function isDidClaimEvent(something) {
        return something.event === 'DidClaim';
    }
    Unidirectional.isDidClaimEvent = isDidClaimEvent;
    function isDidStartSettlingEvent(something) {
        return something.event === 'DidStartSettling';
    }
    Unidirectional.isDidStartSettlingEvent = isDidStartSettlingEvent;
    function isDidSettleEvent(something) {
        return something.event === 'DidSettle';
    }
    Unidirectional.isDidSettleEvent = isDidSettleEvent;
    function contract(provider, defaults) {
        let instance = truffle(Unidirectional.ARTIFACT);
        if (provider) {
            instance.setProvider(provider);
        }
        if (defaults) {
            instance.defaults(defaults);
        }
        return instance;
    }
    Unidirectional.contract = contract;
})(Unidirectional = exports.Unidirectional || (exports.Unidirectional = {}));
exports.default = Unidirectional;
//# sourceMappingURL=Unidirectional.js.map