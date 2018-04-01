import {PaymentChannel} from 'machinomy/dist/lib/channel'
import VynosBuyResponse from '../../lib/VynosBuyResponse'
import Machinomy from 'machinomy'
import SharedStateView from '../SharedStateView'
import {WorkerState} from '../WorkerState'
import {Store} from 'redux'
import * as actions from '../actions'
import {PaymentChannelSerde, SerializedPaymentChannel} from 'machinomy/dist/lib/payment_channel'
import JsonRpcServer from '../../lib/messaging/JsonRpcServer'
import {
  BuyRequest,
  CloseChannelsForCurrentHubRequest, DepositRequest,
  ListChannelsRequest,
  PopulateChannelsRequest
} from '../../lib/rpc/yns'
import AbstractController from './AbstractController'
import Web3 = require('web3')
import ChannelContract from 'machinomy/dist/lib/channel_contract'
import requestJson, {request} from '../../frame/lib/request'


export default class MicropaymentsController extends AbstractController {
  store: Store<WorkerState>

  sharedStateView: SharedStateView

  machinomy: Machinomy

  web3: Web3

  timeout: any

  lastAddress: string

  constructor (web3: Web3, store: Store<WorkerState>, sharedStateView: SharedStateView) {
    super()
    this.web3 = web3
    this.store = store
    this.sharedStateView = sharedStateView
    this.startScanningPendingChannelIds = this.startScanningPendingChannelIds.bind(this)
    this.startScanningPendingChannelIds()
  }

  public async populateChannels (): Promise<void> {
    const machinomy = await this.getMachinomy()
    const channels = await machinomy.channels()

    if (!channels || !channels.length) {
      try {
        const channelIds = await this.getChannelsByPublicKey()

        for (let i = 0; i < channelIds.length; i++) {
          await machinomy.channelById(channelIds[i])
        }

        await this.populateChannels()

      } catch (err) {
        console.log(err)
      }
    } else {
      this.store.dispatch(actions.setChannels(channels.map(
        (ch: PaymentChannel) => PaymentChannelSerde.instance.serialize(ch))))
    }


  }

  public async startScanningPendingChannelIds (): Promise<void> {
    this.timeout = null
    const machinomy = await this.getMachinomy()
    const state = this.store.getState()
    const { pendingChannelIds, didInit } = state.persistent
    const isLocked = !state.runtime.wallet

    if (!pendingChannelIds || !pendingChannelIds.length) {
      return
    }

    pendingChannelIds.forEach(async channelId => {
      if (isLocked || !didInit) {
        return
      }

      const paymentChannel = await machinomy.channelById(channelId)

      if (paymentChannel) {
        // Initialize channel with a 0 tip
        await this.initChannel()
        // Remove channelId from watchers
        this.store.dispatch(actions.removePendingChannel(channelId))
      }
    })

    this.timeout = setTimeout(this.startScanningPendingChannelIds, 15000)
  }

  public async closeChannelsForCurrentHub (): Promise<void> {
    this.store.dispatch(actions.setHasActiveWithdrawal(true))

    try {
      const sharedState = await this.sharedStateView.getSharedState()
      const hubUrl = await this.sharedStateView.getHubUrl()

      const channels = sharedState.channels[hubUrl]

      if (!channels) {
        return
      }

      await Promise.all(channels.map((ch: SerializedPaymentChannel) => this.closeChannel(hubUrl, ch.channelId)))
      await this.populateChannels()
    } finally {
      this.store.dispatch(actions.setHasActiveWithdrawal(false))
    }
  }

  public async deposit(amount: number): Promise<void> {
    const sharedState = await this.sharedStateView.getSharedState()
    const hubUrl = await this.sharedStateView.getHubUrl()
    const machinomy = await this.getMachinomy()
    const channels = sharedState.channels[hubUrl]

    if (channels && channels.length) {
      await machinomy.deposit(channels[0].channelId, amount)
    } else {
      const receiver = sharedState.branding.address
      const channelId = ChannelContract.generateId()
      this.store.dispatch(actions.openChannel(channelId))

      if (!this.timeout) {
        this.startScanningPendingChannelIds()
      }

      try {
        await machinomy.open(receiver, amount, channelId)
      } catch (err) {
        if (err.code === -32603) {
          this.store.dispatch(actions.removePendingChannel(channelId))
        }
        throw err
      }

      // Initialize channel with a 0 tip
      await this.initChannel()
      // Remove channelId from watchers
      this.store.dispatch(actions.removePendingChannel(channelId))
    }
  }

  public async buy (price: number, meta: any): Promise<VynosBuyResponse> {
    const sharedState = await this.sharedStateView.getState()

    if (sharedState.runtime.hasActiveWithdrawal) {
      throw new Error('Can\'t tip while a withdrawal is active.')
    }

    const receiver = (await this.sharedStateView.getSharedState()).branding.address
    const hubUrl = await this.sharedStateView.getHubUrl()
    const machinomy = await this.getMachinomy()
    const channels = await machinomy.channels()

    // machinomy performs the below two checks internally, however
    // it will open a channel automatically if no suitable existing
    // channels are found. the wallet needs user interaction to fill it,
    // so we throw errors if there is no open channel or the channel does
    // not have sufficient funds.
    if (!channels.length) {
      throw new Error('A channel must be open.')
    }

    const chan = channels[0]

    if (chan.spent.add(price).gt(chan.value)) {
      throw new Error('Insufficient funds.')
    }

    const res = await machinomy.buy({
      gateway: `${hubUrl}/payments`,
      receiver,
      price,
      meta: JSON.stringify(meta)
    })

    await this.populateChannels()

    return {
      channelId: res.channelId,
      token: res.token
    }
  }

  public registerHandlers (server: JsonRpcServer) {
    this.registerHandler(server, PopulateChannelsRequest.method, this.populateChannels)
    this.registerHandler(server, CloseChannelsForCurrentHubRequest.method, this.closeChannelsForCurrentHub)
    this.registerHandler(server, DepositRequest.method, this.deposit)
    this.registerHandler(server, ListChannelsRequest.method, this.listChannels)
    this.registerHandler(server, BuyRequest.method, this.buy)
  }

  public async listChannels (): Promise<PaymentChannel[]> {
    const machinomy = await this.getMachinomy()
    return machinomy.channels()
  }

  private async getMachinomy (): Promise<Machinomy> {
    const accounts = await this.sharedStateView.getAccounts()
    const address = accounts[0]

    if (this.machinomy && this.lastAddress === address) {
      return this.machinomy
    }

    this.machinomy = new Machinomy(address, this.web3, {
      databaseUrl: `nedb://vynos-${address}`,
      settlementPeriod: Number.MAX_SAFE_INTEGER
    })

    this.lastAddress = address

    return this.machinomy
  }

  private async closeChannel (hubUrl: string, channelId: string): Promise<void> {
    await request(`${hubUrl}/channels/${channelId}/close`, {
      method: 'POST',
      credentials: 'include'
    })
  }

  private async initChannel () {
    /**
     * This is needed because the smart contracts requires a payment to be provided to the claim
     * method. Clicking withdraw uses the 'claim' method on the hub since claiming is instant.
     */
    await this.buy(0, {
      streamId: 'probe',
      streamName: 'Channel Open/Deposit Probe',
      performerId: 'probe',
      performerName: 'Channel Open/Deposit Probe',
      performerAddress: '0x0000000000000000000000000000000000000000'
    })

    await this.populateChannels()
  }

  private async getChannelsByPublicKey(): Promise<string[]> {
    const hubUrl = await this.sharedStateView.getHubUrl()
    const accounts = await this.sharedStateView.getAccounts()
    const address = accounts[0]

    const res = await requestJson(`${hubUrl}/accounts/${address}/channelIds`, {
      method: 'GET',
      credentials: 'include'
    })

    return res as string[]
  }
}
