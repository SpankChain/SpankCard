import {HistoryItem, WorkerState} from '../WorkerState'
import {Store} from 'redux'
import * as actions from '../actions'
import SharedStateView from '../SharedStateView'
import JsonRpcServer from '../../lib/messaging/JsonRpcServer'
import AbstractController from './AbstractController'
import {FetchHistoryRequest} from '../../lib/rpc/yns'
import requestJson from '../../frame/lib/request'

export interface BrandingResponse {
  title?: string
  companyName?: string
  username?: string
  backgroundColor?: string
  textColor?: string
  address: string
}

export default class HubController extends AbstractController {
  store: Store<WorkerState>

  sharedStateView: SharedStateView

  hubUrl: string

  constructor (store: Store<WorkerState>, sharedStateView: SharedStateView) {
    super()
    this.store = store
    this.sharedStateView = sharedStateView
  }

  async fetchHistory (): Promise<HistoryItem[]> {
    const hubUrl = await this.sharedStateView.getHubUrl()
    const address = (await this.sharedStateView.getAccounts())[0]
    const history = await requestJson<HistoryItem[]>(`${hubUrl}/payments/${address}`, {
      credentials: 'include'
    })

    this.store.dispatch(actions.setHistory(history))
    return history
  }

  registerHandlers (server: JsonRpcServer) {
    this.registerHandler(server, FetchHistoryRequest.method, this.fetchHistory)
  }
}
