"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function txPrice(web3, log) {
    return web3.eth.getTransaction(log.tx).gasPrice.mul(log.receipt.gasUsed);
}
exports.txPrice = txPrice;
//# sourceMappingURL=index.js.map