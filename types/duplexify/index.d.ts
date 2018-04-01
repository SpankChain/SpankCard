declare module "duplexify" {
  import {Duplex, Readable, Writable} from "readable-stream";

  class Duplexify extends Duplex {
    constructor(writable?: Writable, readable?: Readable);
    static obj(): Duplexify;
    setReadable(stream: Readable): void;
    setWritable(stream: Writable): void;
  }

  export = Duplexify;
}
