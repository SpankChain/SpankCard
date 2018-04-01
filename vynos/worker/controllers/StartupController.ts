import {Store} from 'redux'
import {WorkerState} from '../WorkerState'
import * as actions from '../actions'
import {BrandingResponse} from './HubController'
import requestJson from '../../frame/lib/request'

export default class StartupController {
  private store: Store<WorkerState>

  constructor (store: Store<WorkerState>) {
    this.store = store
  }

  public async registerHub (hubUrl: string, authRealm: string) {
    this.setCurrentHubUrl(hubUrl)
    this.setAuthRealm(authRealm)
    await this.getHubBranding(hubUrl)
  }

  private setCurrentHubUrl (hubUrl: string) {
    this.store.dispatch(actions.setCurrentHubUrl(hubUrl))
  }

  private setAuthRealm (authRealm: string) {
    this.store.dispatch(actions.setCurrentAuthRealm(authRealm))
  }

  private async getHubBranding (hubUrl: string): Promise<null> {
    const res = await requestJson<BrandingResponse>(`${hubUrl}/branding`)
    this.store.dispatch(actions.setHubBranding(res))
    return null
  }
}
