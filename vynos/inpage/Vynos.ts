import VynosClient from './VynosClient'
import * as EventEmitter from 'events'
import Frame from './Frame'
import {WalletOptions} from '../WalletOptions'
import {SharedState} from '../worker/WorkerState'
import * as BigNumber from 'bignumber.js';
import Web3 = require('web3')
import VynosBuyResponse from '../lib/VynosBuyResponse'

export interface Balance {
  balanceInWei: string
}

export interface GetBalanceResponse {
  wallet: Balance
  channels: {
    [key: string]: Balance
  }
}

export default class Vynos extends EventEmitter {
  private options: WalletOptions

  private client: VynosClient

  private open: boolean = false

  private ready: boolean

  private frame: Frame

  private previousState: SharedState

  private initializing: Promise<void>

  provider: Web3.Provider

  constructor (options: WalletOptions) {
    super()
    this.options = options
    this.handleSharedStateUpdate = this.handleSharedStateUpdate.bind(this)
  }

  public async getBalance(): Promise<GetBalanceResponse> {
    return this.client.getSharedState()
      .then(state => {
        const { balance, channels, currentHubUrl } = state
        const currentChannels = channels[currentHubUrl] || []
        return {
          wallet: { balanceInWei: balance },
          channels: currentChannels.reduce((acc: any, channel: any) => {
            const { channelId, spent, value } = channel
            acc[channel.channelId] = { balanceInWei: `${value - spent}` }
            return acc
          }, {}),
        }
      })
  }

  public async buy (amount: BigNumber.BigNumber, meta: any): Promise<VynosBuyResponse|null> {
    this.requireReady()
    const { didInit, isLocked } = await this.client.getSharedState()

    if (!didInit || isLocked) {
      this.show()
      return null
    }

    let res

    try {
      res = await this.client.buy(amount.toNumber(), meta)
    } catch (err) {
      this.emit('error', err)
      throw err
    }

    this.emit('didBuy', res)
    return res
  }

  public async lock() {
    this.requireReady()
    return this.client.lock()
  }

  public show(forceRedirect?: string, isPerformer?: boolean) {
    this.requireReady()
    this.client.toggleFrame(true, forceRedirect, isPerformer)
      .catch((e: any) => this.emit('error', e))
  }

  public hide() {
    this.requireReady()
    this.client.toggleFrame(false)
      .catch((e: any) => this.emit('error', e))
  }

  public isReady(): boolean {
    return this.ready
  }

  public isOpen(): boolean {
    return this.open
  }

  public async init () {
    if (this.ready) {
      return
    }

    if (this.initializing) {
      return this.initializing
    }

    this.initializing = this.doInit()
    return this.initializing
  }

  private async doInit() {
    await this.domReady()

    this.frame = new Frame(this.options.scriptElement.src)
    this.frame.attach(this.options.window.document)

    const src = this.frame.element.src
    const parts = src.split('/')
    const origin = `${parts[0]}//${parts[2]}`

    this.client = new VynosClient(this.frame.element.contentWindow, origin)

    try {
      await this.client.initialize(this.options.hubUrl, this.options.authRealm)
    } catch (err) {
      this.emit('error', err)
      throw err
    }

    this.previousState = await this.client.getSharedState()
    this.client.onSharedStateUpdate(this.handleSharedStateUpdate)
    this.emit('update', this.previousState)

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.which === 27) {
        this.client.toggleFrame(false)
      }
    })

    this.ready = true
    this.emit('ready')

    if (!this.previousState.isLocked) {
      this.emit('didUnlock', this.previousState.address)
    }
  }

  async setupAndLogin (): Promise<{ token: string }> {
    this.requireReady()

    const res = await this.client.authenticate()
    const token = res.token


    if (!token) {
      throw new Error('No token returned.')
    }

    return {
      token
    }
  }

  setContainerStyle (style: CSSStyleDeclaration): void {
    this.frame.setContainerStyle(style)
  }

  private handleSpecificEvents(newState: SharedState) {
    if (this.previousState.isFrameDisplayed !== newState.isFrameDisplayed) {
      if (newState.isFrameDisplayed) {
        this.emit('didShow')
      } else {
        this.emit('didHide')
      }
    }

    if (newState.isFrameDisplayed) {
      this.frame.display()
    } else {
      this.frame.hide()
    }

    if (this.previousState.isLocked !== newState.isLocked) {
      this.emit(newState.isLocked ? 'didLock' : 'didUnlock')
    }

    if (this.previousState.didInit !== newState.didInit && newState.didInit) {
      this.emit('didOnboard')
    }

    if (this.previousState.currentAuthToken !== newState.currentAuthToken) {
      this.emit('didAuthenticate', newState.currentAuthToken)
    }
  }

  private requireReady() {
    if (!this.ready) {
      throw new Error('Wallet not ready yet.')
    }
  }

  private domReady (): Promise<any> {
    return new Promise((resolve) => {
      const state = document.readyState

      if (state === 'complete' || state === 'interactive') {
        return resolve()
      }

      document.addEventListener('DOMContentLoaded', resolve)
    })
  }

  private handleSharedStateUpdate(nextState: SharedState) {
    this.handleSpecificEvents(nextState)
    this.emit('update', nextState)
    this.previousState = nextState
  }
}
