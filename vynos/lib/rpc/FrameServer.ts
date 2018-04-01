import JsonRpcServer, {ErrResCallback} from '../messaging/JsonRpcServer'
import {
  AuthenticateRequest,
  BuyRequest,
  GetSharedStateRequest,
  InitAccountRequest,
  RegisterHubRequest,
  ListChannelsRequest,
  ToggleFrameRequest, LockWalletRequest
} from './yns'
import WorkerProxy from '../../frame/WorkerProxy'
import {AllowedOrigins} from '../messaging/OriginValidator'
import {ReadyBroadcastEvent} from './ReadyBroadcast'
import {WorkerReadyBroadcastEvent} from './WorkerReadyBroadcast'
import {ResetBroadcastEvent} from './ResetBroadcast'

export default class FrameServer extends JsonRpcServer {
  private workerProxy: WorkerProxy

  constructor (allowedOrigins: AllowedOrigins, workerProxy: WorkerProxy) {
    super('FrameServer', allowedOrigins, window, window.parent)
    this.workerProxy = workerProxy

    this.passThroughHandler(RegisterHubRequest.method)
    this.passThroughHandler(InitAccountRequest.method)
    this.passThroughHandler(BuyRequest.method)
    this.passThroughHandler(ListChannelsRequest.method)
    this.passThroughHandler(GetSharedStateRequest.method)
    this.passThroughHandler(AuthenticateRequest.method)
    this.passThroughHandler(ToggleFrameRequest.method)
    this.passThroughHandler(LockWalletRequest.method)

    this.passThroughEvent(ReadyBroadcastEvent)
    this.passThroughEvent(WorkerReadyBroadcastEvent)
    this.passThroughEvent(ResetBroadcastEvent)
  }

  private passThroughHandler (method: string) {
    this.addHandler(method, (cb: ErrResCallback, ...args: any[]) => {
      this.workerProxy.call(method, ...args)
        .then((res: any) => cb(null, res))
        .catch((err: any) => cb(err, null))
    })
  }

  private passThroughEvent(name: string) {
    this.workerProxy.addListener(name, (...args: any[]) => this.broadcast(name, ...args))
  }
}
