declare module "ethereumjs-wallet" {
  import { Buffer } from "buffer";

  class Wallet {
    static fromPrivateKey(key: Buffer): Wallet;
    getPrivateKey(): Buffer;
    getAddressString(): string;
  }

  export = Wallet;
}

declare module "ethereumjs-wallet/hdkey" {
  import Wallet = require("ethereumjs-wallet");

  class EthereumHDKey {
    getWallet(): Wallet
  }

  function fromMasterSeed(seed: string): EthereumHDKey

  export = {
    fromMasterSeed: fromMasterSeed
  }
}
