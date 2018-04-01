import {
  AuthenticateRequest,
  AuthenticateResponse,
  BuyRequest,
  GetSharedStateRequest,
  InitAccountRequest,
  ListChannelsRequest,
  LockWalletRequest,
  RegisterHubRequest,
  ToggleFrameRequest
} from '../lib/rpc/yns'
import {PaymentChannel} from 'machinomy/dist/lib/channel'
import VynosBuyResponse from '../lib/VynosBuyResponse'
import {SharedState} from '../worker/WorkerState'
import {PaymentChannelSerde, SerializedPaymentChannel} from 'machinomy/dist/lib/payment_channel'
import JsonRpcClient from '../lib/messaging/JsonRpcClient'
import {WorkerReadyBroadcastEvent} from '../lib/rpc/WorkerReadyBroadcast'
import {SharedStateBroadcastEvent} from '../lib/rpc/SharedStateBroadcast'
import {ResetBroadcastEvent} from '../lib/rpc/ResetBroadcast'

export default class VynosClient extends JsonRpcClient {
  workerReady: boolean = false

  constructor (target: Window, origin: string) {
    super('VynosClient', target, window, origin)
    this.onWorkerReady = this.onWorkerReady.bind(this)
    this.onReset = this.onReset.bind(this)
    this.once(WorkerReadyBroadcastEvent, this.onWorkerReady)
    this.on(ResetBroadcastEvent, this.onReset)
  }

  onWorkerReady () {
    this.workerReady = true
  }

  onReset () {
    window.location.reload()
  }

  async initialize (hubUrl: string, authRealm: string): Promise<boolean> {
    if (!this.workerReady) {
      await new Promise((resolve) => this.once(WorkerReadyBroadcastEvent, resolve))
    }

    return this.call<boolean>(RegisterHubRequest.method, hubUrl, authRealm)
  }

  initAccount (): Promise<void> {
    return this.call(InitAccountRequest.method)
  }

  buy (amount: number, meta: any): Promise<VynosBuyResponse> {
    return this.call(BuyRequest.method, amount, meta)
  }

  listChannels (): Promise<PaymentChannel[]> {
    return this.call(ListChannelsRequest.method).then((res: SerializedPaymentChannel[]) =>
      res.map(pc => PaymentChannelSerde.instance.deserialize(pc)))
  }

  getSharedState (): Promise<SharedState> {
    return this.call(GetSharedStateRequest.method)
  }

  onSharedStateUpdate (fn: (state: SharedState) => void): void {
    this.addListener(SharedStateBroadcastEvent, (state: SharedState) => fn(state))
  }

  authenticate (): Promise<AuthenticateResponse> {
    return this.call(AuthenticateRequest.method, window.location.hostname)
  }

  toggleFrame (state: boolean, forceRedirect?: string, isPerformer?: boolean): Promise<void> {
    return this.call(ToggleFrameRequest.method, state, forceRedirect, isPerformer)
  }

  lock (): Promise<void> {
    return this.call(LockWalletRequest.method)
  }
}
