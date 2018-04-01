import {Store} from 'redux'
import {buildSharedState, SharedState, WorkerState} from '../WorkerState'
import * as actions from '../actions'
import Keyring from '../../frame/lib/Keyring'
import {EventEmitter} from 'events'
import JsonRpcServer from '../../lib/messaging/JsonRpcServer'
import AbstractController from './AbstractController'
import {
  DidStoreMnemonicRequest,
  GenKeyringRequest,
  GetSharedStateRequest,
  InitAccountRequest,
  LockWalletRequest,
  RememberPageRequest,
  RestoreWalletRequest,
  TransactionResolved,
  UnlockWalletRequest
} from '../../lib/rpc/yns'
import bip39 =require('bip39')
import hdkey = require('ethereumjs-wallet/hdkey')
import Wallet = require('ethereumjs-wallet')

const STATE_UPDATED_EVENT = 'stateUpdated'

export default class BackgroundController extends AbstractController {
  store: Store<WorkerState>

  events: EventEmitter

  constructor (store: Store<WorkerState>) {
    super()
    this.store = store
    this.events = new EventEmitter()
  }

  awaitUnlock (fn: Function) {
    const tryCall = () => {
      this.getSharedState().then(sharedState => {
        let isUnlocked = !sharedState.isLocked && sharedState.didInit
        if (isUnlocked) {
          fn()
        } else {
          this.events.once(STATE_UPDATED_EVENT, tryCall)
        }
      })
    }
    tryCall()
  }

  async isLocked (): Promise<boolean> {
    const state = await this.getSharedState()
    return state.isLocked || !state.didInit
  }

  resolveTransaction () {
    this.store.dispatch(actions.setLastUpdateDb(Date.now()))
  }

  rememberPage (path: string) {
    this.store.dispatch(actions.rememberPage(path))
  }

  getSharedState (): Promise<SharedState> {
    return this.getState().then(buildSharedState)
  }

  async getState (): Promise<WorkerState> {
    return this.store.getState()
  }

  genKeyring (password: string): Promise<string> {
    let mnemonic = bip39.generateMnemonic()
    let keyring = this._generateKeyring(password, mnemonic)
    return Keyring.serialize(keyring, password).then(serialized => {
      this.store.dispatch(actions.setKeyring(serialized))
      return mnemonic
    })
  }

  _generateKeyring (password: string, mnemonic: string): Keyring {
    let wallet = hdkey.fromMasterSeed(mnemonic).getWallet()
    this.store.dispatch(actions.setWallet(wallet))
    let privateKey = wallet.getPrivateKey()
    return new Keyring(privateKey)
  }

  restoreWallet (password: string, mnemonic: string): Promise<void> {
    let keyring = this._generateKeyring(password, mnemonic)
    let wallet = keyring.wallet
    return Keyring.serialize(keyring, password).then(serialized => {
      this.store.dispatch(actions.restoreWallet({keyring: serialized, wallet: wallet}))
    })
  }

  getAccounts (): Promise<Array<string>> {
    return this.getWallet().then(wallet => {
      let account = wallet.getAddressString()
      return [account]
    }).catch(() => {
      return []
    })
  }

  getWallet (): Promise<Wallet> {
    return this.getState().then(state => {
      let wallet = state.runtime.wallet
      if (wallet) {
        return Promise.resolve(wallet)
      } else {
        return Promise.reject(new Error('Wallet is not available'))
      }
    })
  }

  getPrivateKey (): Promise<Buffer> {
    return this.getWallet().then(wallet => {
      return wallet.getPrivateKey()
    })
  }

  async didStoreMnemonic (): Promise<void> {
    this.store.dispatch(actions.setDidStoreMnemonic(true))
  }

  unlockWallet (password: string): Promise<void> {
    return this.getState().then(state => {
      let keyring = state.persistent.keyring
      if (keyring) {
        return Promise.resolve(Keyring.deserialize(keyring, password))
      } else {
        return Promise.reject(new Error('Keyring is not present'))
      }
    }).then((keyring: Keyring) => {
      this.store.dispatch(actions.setWallet(keyring.wallet))
    })
  }

  lockWallet (): Promise<void> {
    return this.getState().then(() => {
      this.store.dispatch(actions.setWallet(undefined))
    })
  }

  didChangeSharedState (fn: (state: SharedState) => void) {
    this.store.subscribe(() => {
      this.events.emit(STATE_UPDATED_EVENT)
      this.getSharedState().then(sharedState => {
        fn(sharedState)
      })
    })
  }

  registerHandlers (server: JsonRpcServer) {
    this.registerHandler(server, GetSharedStateRequest.method, this.getSharedState)
    this.registerHandler(server, GenKeyringRequest.method, this.genKeyring)
    this.registerHandler(server, RestoreWalletRequest.method, this.restoreWallet)
    this.registerHandler(server, DidStoreMnemonicRequest.method, this.didStoreMnemonic)
    this.registerHandler(server, UnlockWalletRequest.method, this.unlockWallet)
    this.registerHandler(server, LockWalletRequest.method, this.lockWallet)
    this.registerHandler(server, InitAccountRequest.method, this.awaitUnlock)
    this.registerHandler(server, RememberPageRequest.method, this.rememberPage)
    this.registerHandler(server, TransactionResolved.method, this.getSharedState)
  }
}
