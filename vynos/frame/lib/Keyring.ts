import Wallet = require("ethereumjs-wallet")
import passworder = require("browser-passworder")
import { Buffer } from "buffer";

interface BufferLike {
  type: string;
  data: string;
}

function isBufferLike(something: BufferLike|any): something is BufferLike {
  return (something as BufferLike).type === "Buffer"
}

export default class Keyring {
  wallet: Wallet;

  static serialize (keyring: Keyring, password: string): Promise<string> {
    let privateKey = keyring.wallet.getPrivateKey();
    return passworder.encrypt(password, privateKey).then((string: string) => {
      return Buffer.from(string).toString("base64")
    })
  }

  static deserialize (string: string, password: string): Promise<Keyring> {
    let unbase64 = Buffer.from(string, "base64").toString();
    return passworder.decrypt(password, unbase64).then((privateKey: Buffer|BufferLike) => {
      if (isBufferLike(privateKey)) {
        return new Keyring(Buffer.from(privateKey.data))
      } else {
        return new Keyring(privateKey)
      }
    })
  }

  constructor (privateKey: Buffer) {
    this.wallet = Wallet.fromPrivateKey(privateKey);
  }
}
