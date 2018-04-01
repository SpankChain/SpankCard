import JsonRpcServer, {ErrResCallback} from '../messaging/JsonRpcServer'
import {Postable} from '../messaging/Postable'
import Engine = require('web3-provider-engine')
import Web3 = require('web3')

import {ProviderOpts} from 'web3-provider-engine'
import BackgroundController from '../../worker/controllers/BackgroundController'
import ProviderOptions from '../../worker/controllers/ProviderOptions'
import {Handler} from 'express'
import ZeroClientProvider = require('web3-provider-engine/zero')
import {JSONRPC, randomId} from '../Payload'
import {Listenable} from '../messaging/Listenable'

const networks = require('../../networks.json')
const DEFAULT_NETWORK = 'Ropsten'

export default class WorkerServer extends JsonRpcServer {
  private provider: Engine

  providerOpts: ProviderOpts

  web3: Web3

  constructor (backgroundController: BackgroundController, source: Listenable, target: WindowClient) {
    super('WorkerServer', [ process.env.FRAME_URL as string ], source, target)
    this.providerOpts = new ProviderOptions(backgroundController, networks[DEFAULT_NETWORK]).approving()
    this.provider = ZeroClientProvider(this.providerOpts)
    this.web3 = new Web3(this.provider)
  }

  public findHandler (method: string): Handler | any {
    if (method.indexOf('eth_') === 0) {
      return (cb: ErrResCallback, ...params: any[]) => {
        return this.provider.sendAsync({
          id: randomId(),
          method,
          jsonrpc: JSONRPC,
          params
        }, cb)
      }
    }

    return super.findHandler(method)
  }
}
