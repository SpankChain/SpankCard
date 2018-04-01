import {EventEmitter} from 'events'
import {JSONRPC} from '../Payload'
import OriginValidator, {AllowedOrigins} from './OriginValidator'
import {Postable} from './Postable'
import {IDebugger} from 'debug'
import debug from '../debug'
import {Listenable} from './Listenable'

const METHOD_NOT_FOUND = -32601

export type ErrResCallback = (err: any, res: any) => void

export type Handler = (cb: ErrResCallback, ...args: any[]) => void

interface Validator {
  [k: string]: (f: any) => boolean
}

const FIELD_VALIDATORS: Validator = {
  id: (id: any) => typeof id === 'number',
  jsonrpc: (v: any) => v === JSONRPC,
  method: (v: any) => typeof v === 'string' && v.length > 0,
  params: (v: any) => Array.isArray(v)
}

const FIELDS = Object.keys(FIELD_VALIDATORS)

export default class JsonRpcServer extends EventEmitter {
  private originValidator: OriginValidator

  private handlers: { [k: string]: Handler } = {}

  private source: Listenable

  private target: Postable

  private log: IDebugger

  constructor (name: string, allowedOrigins: AllowedOrigins, source: Listenable, target: Postable) {
    super()
    this.log = debug(`JsonRpcServer:${name}`)
    this.originValidator = new OriginValidator(allowedOrigins)
    this.source = source
    this.target = target
    this.onMessage = this.onMessage.bind(this)
    this.source.addEventListener('message', this.onMessage)
  }

  public async stop (): Promise<void> {
    this.source.removeEventListener('message', this.onMessage)
  }

  public broadcast(type: string, ...data: any[]) {
    this.log('Broadcasting %s', type)

    if (typeof WindowClient !== 'undefined' && (this.target as any).isWrapper) {
      this.target.postMessage({
        type: `broadcast/${type}`,
        data
      })
    } else {
      this.target.postMessage({
        type: `broadcast/${type}`,
        data
      }, '*')
    }
  }

  public addHandler(name: string, handler: Handler) {
    if (this.handlers[name]) {
      throw new Error(`Handler ${name} already added.`)
    }

    this.handlers[name] = handler
  }

  public findHandler(method: string): Handler|undefined {
    return this.handlers[method]
  }

  private onMessage (e: any) {
    const data = e.data

    let origin = e.origin

    // Firefox doesn't set the origin for some reason. See https://bugzilla.mozilla.org/show_bug.cgi?id=1448740
    if (!origin || !origin.length) {
      const sourceLoc = e.source.url
      const parts = sourceLoc.split('/')
      origin = `${parts[0]}//${parts[2]}`
    }

    if (!this.originValidator.isAllowed(origin)) {

      this.log('Received message from non-whitelisted origin %s.', origin)
      return
    }

    if (!this.validateRpcPayload(data)) {
      this.log('Received invalid RPC payload: %O', data)
      return
    }

    this.log('Received message: %o', data)

    const handler = this.findHandler(data.method)

    if (!handler) {
      this.log('No handler found for method %s.', data.method)
      return this.sendErrorResponse(e, METHOD_NOT_FOUND, `Method ${data.method} not found.`)
    }

    handler((err: any, res: any) => {
      if (err) {
        this.log('Handler returned an error for method %s: %O', data.method, err)
        return this.sendErrorResponse(e, err.code || -1, err.message || 'An error occurred.')
      }

      this.log('Returning response for method %s.', data.method)
      return this.sendResponse(e, res)
    }, ...data.params)
  }

  private sendErrorResponse(e: any, code: number, message: string) {
    const { jsonrpc, id } = e.data

    e.ports[0].postMessage({
      id,
      jsonrpc,
      error: {
        code,
        message
      }
    })
  }

  private sendResponse(e: any, result: any) {
    const { jsonrpc, id } = e.data

    e.ports[0].postMessage({
      id,
      jsonrpc,
      result
    })
  }

  private validateRpcPayload (data: any): boolean {
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
}
