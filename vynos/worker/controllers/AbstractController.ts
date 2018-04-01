import JsonRpcServer, {ErrResCallback} from '../../lib/messaging/JsonRpcServer'

export default class AbstractController {
  protected registerHandler(server: JsonRpcServer, method: string, func: (...args: any[]) => any) {
    server.addHandler(method, async (cb: ErrResCallback, ...args: any[]) => {
      let res

      try {
        res = func.apply(this, args)

        if (typeof res !== 'undefined' && res.then) {
          res = await res
        }
      } catch (e) {
        return cb(e, null)
      }

      cb(null, typeof res === 'undefined' ? null : res)
    })
  }
}
