import {EventEmitter} from 'events'
import {JSONRPC, randomId} from '../Payload'
import JsonRpcError from './JsonRpcError'
import {Listenable} from './Listenable'
import {IDebugger} from 'debug'
import debug from '../debug'
import {Postable} from './Postable'

interface Validator {
  [k: string]: (f: any) => boolean
}

const FIELD_VALIDATORS: Validator = {
  id: (id: any) => typeof id === 'number',
  jsonrpc: (v: any) => v === JSONRPC,
  result: (v: any) => typeof v !== undefined
}

const FIELDS = Object.keys(FIELD_VALIDATORS)

export default class JsonRpcClient extends EventEmitter {
  private target: any

  private receiver: Listenable

  private origin: string

  private log: IDebugger

  constructor (name: string, target: Postable, receiver: Listenable, origin: string) {
    super()
    this.log = debug(`JsonRpcClient:${name}`)
    this.target = target
    this.receiver = receiver
    this.origin = origin

    this.onMessage = this.onMessage.bind(this)
    this.receiver.addEventListener('message', this.onMessage)
  }

  public onMessage (e: any) {
    const data = e.data

    if (e.origin !== this.origin) {
      this.log('Received message from invalid origin %s.', e.origin)
      return
    }

    if (!this.validateBroadcastPayload(data)) {
      this.log('Received invalid broadcast payload: %O', data)
      return
    }

    this.log('Received broadcast: %o', data)
    this.emit(data.type.replace('broadcast/', ''), ...data.data)
  }

  public call<T>(method: string, ...params: any[]): Promise<T> {
    return this.callWithTimeout(600000, method, ...params)
  }

  public callWithTimeout<T>(timeout: number, method: string, ...params: any[]): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const channel = new MessageChannel()
      const timer = setTimeout(() => reject(new Error(`Timed out. Method: ${method}`)), timeout)
      const id = randomId()

      const payload = {
        id,
        jsonrpc: JSONRPC,
        method,
        params
      }

      this.log('Sending method call: %o', payload)

      if (this.target instanceof ServiceWorker) {
        this.target.postMessage(payload, [channel.port2])
      } else {
        this.target.postMessage(payload, this.origin, [channel.port2])
      }

      channel.port1.onmessage = (e: any) => {
        const data = e.data

        this.log('Received method call response: %o', data)

        if (!this.validateRpcPayload(data)) {
          return
        }

        if (data.id !== id) {
          return
        }

        clearTimeout(timer)

        if (data.error) {
          return reject(new JsonRpcError(data.error.message, data.error.code))
        }

        resolve(data.result)
      }
    })
  }

  private validateRpcPayload (data: any): boolean {
    if (typeof data !== 'object') {
      return false
    }

    for (let i = 0; i < FIELDS.length; i++) {
      const field = FIELDS[i]
      const validator = FIELD_VALIDATORS[field]
      const value = data[field]

      if (!validator(value)) {
        return false
      }
    }

    return true
  }

  private validateBroadcastPayload (data: any) {
    return typeof data.type === 'string' &&
      data.type.indexOf('broadcast/') === 0 &&
      Array.isArray(data.data)
  }
}
