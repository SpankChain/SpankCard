"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Unidirectional_1 = require("../build/wrappers/Unidirectional");
exports.Unidirectional = Unidirectional_1.default;
const ethUtil = require("ethereumjs-util");
function randomId(digits = 3) {
    const datePart = new Date().getTime() * Math.pow(10, digits);
    const extraPart = Math.floor(Math.random() * Math.pow(10, digits)); // 3 random digits
    return datePart + extraPart; // 16 digits
}
exports.randomId = randomId;
function channelId(sender, receiver) {
    let random = randomId();
    let buffer = ethUtil.sha3(sender + receiver + random);
    return ethUtil.bufferToHex(buffer);
}
exports.channelId = channelId;
//# sourceMappingURL=index.js.map