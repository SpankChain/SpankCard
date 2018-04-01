import SharedStateView from '../SharedStateView'
import {WorkerState} from '../WorkerState'
import {Store} from 'redux'
import {LifecycleAware} from './LifecycleAware'
import {setBalance, setPendingTransaction} from '../actions'
import * as BigNumber from 'bignumber.js'
import {SendRequest} from '../../lib/rpc/yns'
import JsonRpcServer from '../../lib/messaging/JsonRpcServer'
import AbstractController from './AbstractController'
import Web3 = require('web3')

const utils = require('web3-utils')

export default class WalletController extends AbstractController implements LifecycleAware {
  web3: Web3

  store: Store<WorkerState>

  sharedStateView: SharedStateView

  isWatching: boolean = false

  constructor (web3: Web3, store: Store<WorkerState>, sharedStateView: SharedStateView) {
    super()
    this.web3 = web3
    this.store = store
    this.sharedStateView = sharedStateView

    this.watchBalance = this.watchBalance.bind(this)
  }

  public async start (): Promise<void> {
    this.isWatching = true
    this.watchBalance()
  }

  public async stop (): Promise<void> {
    this.stopWatchingBalance()
  }

  public async send (to: string, value: string, gas?: string, gasPrice?: string) {
    const from = (await this.sharedStateView.getAccounts())[0]

    const tx = {
      from,
      to,
      value,
      gas,
      gasPrice,
    }

    const addressError = this.validateAddress(from, to)

    if (addressError) {
      throw new Error(addressError)
    }

    const hash = await new Promise<string>((resolve, reject) => this.web3.eth.sendTransaction(tx, (err: any, txHash: string) => {
      if (err) {
        return reject(err)
      }

      return resolve(txHash)
    }))

    this.store.dispatch(setPendingTransaction({
      amount: value,
      hash
    }))

    const originalBalance = (await this.sharedStateView.getSharedState()).balance

    const poll = async () => new Promise<null | number>((resolve, reject) => this.web3.eth.getTransaction(hash, (err: any, res: any) => {
      if (err) {
        reject(err)
      }

      if (!res.blockNumber) {
        return setTimeout(() => resolve(null), 1000)
      }

      resolve(res.blockNumber)
    }))

    const maxAttempts = 120
    let attempt = 0

    while (attempt < maxAttempts) {
      const ok = await poll()

      if (ok) {
        await this.awaitBalanceChange(originalBalance)
        this.store.dispatch(setPendingTransaction(null))
        return
      }

      attempt++
    }

    this.store.dispatch(setPendingTransaction(null))
    throw new Error('Transaction timed out.')
  }

  public registerHandlers (server: JsonRpcServer) {
    this.registerHandler(server, SendRequest.method, this.send)
  }

  private async awaitBalanceChange (originalBalance: string) {
    let newBalance = (await this.sharedStateView.getSharedState()).balance

    return new Promise((resolve) => {
      if (newBalance !== originalBalance) {
        return resolve()
      }

      const off = this.store.subscribe(async () => {
        newBalance = (await this.sharedStateView.getSharedState()).balance

        if (newBalance !== originalBalance) {
          off()
          resolve()
        }
      })
    })
  }

  private async watchBalance () {
    if (!this.isWatching) {
      return
    }

    let address

    try {
      address = (await this.sharedStateView.getAccounts())[0]
    } catch (e) {
      console.error('Caught error getting accounts:', e)
    }

    if (!address) {
      return setTimeout(this.watchBalance, 1000)
    }

    this.web3.eth.getBalance(address, (err: any, balance: BigNumber.BigNumber) => {
      if (err) {
        console.error('Failed to get balance:', err)
        setTimeout(this.watchBalance, 5000)
      }

      this.store.dispatch(setBalance(balance.toString()))
      setTimeout(this.watchBalance, 5000)
    })
  }

  private stopWatchingBalance () {
    this.isWatching = false
  }

  private validateAddress (currentAddress: string, address: string): string | null {
    if (!address) {
      return 'Address cannot be empty.'
    }

    if (!utils.isAddress(address)) {
      return 'Address is invalid.'
    }

    if (address === currentAddress) {
      return 'Address is the same as your wallet address.'
    }

    return null
  }
}
