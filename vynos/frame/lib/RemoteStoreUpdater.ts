import {Store} from 'react-redux'
import {SharedState} from '../../worker/WorkerState'
import {SharedStateBroadcastEvent} from '../../lib/rpc/SharedStateBroadcast'
import {FrameState} from '../redux/FrameState'
import {setSharedState} from '../redux/actions'
import JsonRpcClient from '../../lib/messaging/JsonRpcClient'

export default class RemoteStoreUpdater {
  private initialState: SharedState

  private client: JsonRpcClient

  constructor (client: JsonRpcClient, initial: SharedState) {
    this.initialState = initial
    this.client = client
  }

  wireToLocal (store: Store<FrameState>) {
    this.client.addListener(SharedStateBroadcastEvent, (sharedState: SharedState) =>
      store.dispatch(setSharedState(sharedState)))
    store.dispatch(setSharedState(this.initialState))
  }
}
