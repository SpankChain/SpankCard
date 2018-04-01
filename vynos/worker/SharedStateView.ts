import {buildSharedState, SharedState, WorkerState} from './WorkerState'
import BackgroundController from './controllers/BackgroundController'
import Wallet = require('ethereumjs-wallet')

export default class SharedStateView {
  private background: BackgroundController

  constructor (background: BackgroundController) {
    this.background = background
  }

  public async getHubUrl(): Promise<string> {
    const state = await this.getState()
    return state.runtime.currentHubUrl
  }

  public async getAuthRealm(): Promise<string> {
    const state = await this.getState()
    return state.runtime.currentAuthRealm
  }

  public async isLocked(): Promise<boolean> {
    const isUnlocked = await this.isUnlocked()
    return !isUnlocked
  }

  public async isUnlocked (): Promise<boolean> {
    const sharedState = await this.getSharedState()
    return !sharedState.isLocked && sharedState.didInit
  }

  public awaitUnlock() {
    return new Promise((resolve) => this.background.awaitUnlock(resolve))
  }

  public async getSharedState (): Promise<SharedState> {
    const state = await this.getState()
    return buildSharedState(state)
  }

  public async getAccounts(): Promise<string[]> {
    try {
      const wallet = await this.getWallet()
      return [wallet.getAddressString()]
    } catch (e) {
      return []
    }
  }

  public async getWallet(): Promise<Wallet> {
    const state = await this.getState()
    const wallet = state.runtime.wallet

    if (!wallet) {
      throw new Error('Wallet is unavailable.')
    }

    return wallet
  }

  public async getState (): Promise<WorkerState> {
    return this.background.getState()
  }
}
