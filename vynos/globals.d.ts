// @flow

type Extension = {
  getBackgroundPage(): Window,
  getURL(resource: string): string
}

type OnEvent = {
  addListener: (handler: () => void) => void
}

type OnMessageEvent = {
  addListener: (handler: (message: any) => void) => void
}

declare type Port = {
  name: string,
  disconnect: () => void,
  onDisconnect: OnEvent,
  onMessage: OnMessageEvent,
  postMessage: (message: any) => void
}

type Runtime = {
  onMessage: {
    addListener: (handler: (message: any, sender: any, sendResponse: (r: any) => void) => void) => void
  },
  sendMessage: (message: any, callback: (response: any) => void) => void,
  Port: Port,
  connect: (params: {name: string}) => Port,
  onConnect: {
    addListener: (handler: (port: Port) => void) => void
  }
}

type CreateProperties = {
  active?: boolean,
  url?: string
}

type Tabs = {
  create: (createProperties: CreateProperties) => void
}

type Chrome = {
  extension: Extension,
  runtime: Runtime,
  tabs: Tabs
}

declare var chrome: Chrome;

interface NodeRequireFunction {
  (id: string): any;
}

interface NodeRequire extends NodeRequireFunction {
  resolve(id: string): string;
  cache: any;
  main: NodeModule | undefined;
}

declare var require: NodeRequire;

interface NodeModule {
  exports: any;
  require: NodeRequireFunction;
  id: string;
  filename: string;
  loaded: boolean;
  parent: NodeModule | null;
  children: NodeModule[];
}

interface WindowClient {
  url: string
  id: string
  frameType?: string
  type: ClientType
  postMessage: (message: any, transfer?: any[]) => void
}

type ClientType = "window" | "worker" | "sharedWorker" | "all"

interface ClientsMatchAllOptions {
  includeUncontrolled?: boolean
  type?: ClientType
}

interface Clients {
  get: (id: string) => Promise<WindowClient>
  matchAll: (options?: ClientsMatchAllOptions) => Promise<Array<WindowClient>>
  openWindow: (url: string) => Promise<WindowClient|null>
  claim: () => Promise<void>;
}

interface ExtendableEvent extends Event {
  waitUntil<A>(promise: Promise<A>): void;
}

interface WorkerGlobalScope extends EventTarget {

}

interface ServiceWorkerGlobalScope extends WorkerGlobalScope {
  clients: Clients
  skipWaiting: () => Promise<void>;
  oninstall: (event: ExtendableEvent) => void;
  onactivate: (event: ExtendableEvent) => void;
  onmessage: (event: MessageEvent) => void;
  registration: ServiceWorkerRegistration;
}

declare var module: NodeModule;

// Same as module.exports
declare var exports: any;

declare var WindowClient: any
