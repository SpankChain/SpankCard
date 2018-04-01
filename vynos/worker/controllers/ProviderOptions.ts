import BackgroundController from './BackgroundController'
import {ProviderOpts} from 'web3-provider-engine'
import ethUtil = require('ethereumjs-util')
import sigUtil = require('eth-sig-util')
import Tx = require('ethereumjs-tx')

export type ApproveTransactionCallback = (error: any, isApproved?: boolean) => void
export type ApproveSignCallback = (error: any, rawMsgSig?: string) => void

export default class ProviderOptions {
  background: BackgroundController
  rpcUrl: string

  constructor (background: BackgroundController, rpcUrl: string) {
    this.background = background
    this.rpcUrl = rpcUrl
  }

  getAccounts (callback: (err: any, accounts?: Array<string>) => void) {
    this.background.getAccounts().then(accounts =>
      callback(null, accounts)
    ).catch(error => {
      callback(error)
    })
  }

  approveTransactionAlways (txParams: any, callback: ApproveTransactionCallback) {
    callback(null, true)
  }

  signTransaction (rawTx: any, callback: any) {
    this.background.getPrivateKey().then(privateKey => {
      let tx = new Tx(rawTx)
      tx.sign(privateKey)
      let txHex = '0x' + Buffer.from(tx.serialize()).toString('hex')
      callback(null, txHex)
    }).catch(error => {
      callback(error.message)
    })
  }

  signMessageAlways (messageParams: any, callback: ApproveSignCallback) {
    this.background.getPrivateKey().then(privateKey => {
      const msg = messageParams.data

      const hashBuf = new Buffer(msg.split('x')[1], 'hex')
      const prefix = new Buffer('\x19Ethereum Signed Message:\n')
      const buf = Buffer.concat([
        prefix,
        new Buffer(String(hashBuf.length)),
        hashBuf
      ])

      const data = ethUtil.sha3(buf)
      const msgSig = ethUtil.ecsign(data, privateKey)
      const rawMsgSig = ethUtil.bufferToHex(sigUtil.concatSig(msgSig.v, msgSig.r, msgSig.s))
      callback(null, rawMsgSig)
    }).catch(error => {
      callback(error.message)
    })
  }

  approving (): ProviderOpts {
    return {
      static: {
        eth_syncing: false,
        web3_clientVersion: `LiteratePayments/v${1.0}`
      },
      rpcUrl: this.rpcUrl,
      getAccounts: this.getAccounts.bind(this),
      approveTransaction: this.approveTransactionAlways.bind(this),
      signTransaction: this.signTransaction.bind(this),
      signMessage: this.signMessageAlways.bind(this)
      // tx signing, newUnapprovedTransaction
      //processTransaction: processTransaction,
      // old style msg signing, newUnsignedMessage
      //processMessage: processMessage,
      // new style msg signing, newUnsignedPersonalMessage
      //processPersonalMessage: processPersonalMessage,
    }
  }
}
