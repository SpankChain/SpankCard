import actionCreatorFactory, {ActionCreator} from 'typescript-fsa'
import {HistoryItem, PendingTransaction, WorkerState} from './WorkerState'
import Wallet from 'ethereumjs-wallet'
import {SerializedPaymentChannel} from 'machinomy/dist/lib/payment_channel'

const actionCreator = actionCreatorFactory('worker')

// Runtime
export const setWallet: ActionCreator<Wallet|undefined> = actionCreator<Wallet|undefined>('runtime/setWallet')
export function setWalletHandler(state: WorkerState, wallet: Wallet|undefined): WorkerState {
  return { ...state,
    runtime: { ...state.runtime, wallet },
  }
}

// Persistent
export const setKeyring: ActionCreator<string> = actionCreator<string>('persistent/setKeyring')
export function setKeyringHandler(state: WorkerState, keyring: string): WorkerState {
  return { ...state,
    persistent: { ...state.persistent, keyring },
  }
}

export interface RestoreWalletParam {
  keyring: string,
  wallet: Wallet
}
export const restoreWallet: ActionCreator<RestoreWalletParam> = actionCreator<RestoreWalletParam>('persistent+runtime/restoreWallet')
export function restoreWalletHandler(state: WorkerState, param: RestoreWalletParam): WorkerState {
  return { ...state,
    persistent: { ...state.persistent, didInit: true, keyring: param.keyring },
    runtime: { ...state.runtime, wallet: param.wallet },
  }
}

export const setDidStoreMnemonic: ActionCreator<boolean> = actionCreator<boolean>('persistent/setDidStoreMnemonic')
export function setDidStoreMnemonicHandler(state: WorkerState): WorkerState {
  return {
    ...state,
    persistent: { ...state.persistent, didInit: true },
  }
}

export const openChannel: ActionCreator<string> = actionCreator<string>('persistent/openChannel')
export function openChannelHandler(state: WorkerState, channelId: string): WorkerState {
  return {
    ...state,
    persistent: {
      ...state.persistent,
      pendingChannelIds: [ ...state.persistent.pendingChannelIds, channelId ],
    },
  }
}

export const removePendingChannel: ActionCreator<string> = actionCreator<string>('persistent/removePendingChannel')
export function removePendingChannelHandler(state: WorkerState, channelId: string): WorkerState {
  return {
    ...state,
    persistent: {
      ...state.persistent,
      pendingChannelIds: state.persistent.pendingChannelIds.filter(id => id !== channelId),
    },
  }
}

export const setTransactionPending: ActionCreator<boolean> = actionCreator<boolean>('runtime/setTransactionPending')
export function setTransactionPendingHandler(state: WorkerState, pending: boolean): WorkerState {
  let pendingDate = 0
  if (pending) {
    pendingDate = Date.now()
  }
  return {
    ...state,
    runtime: { ...state.runtime, isTransactionPending: pendingDate },
  }
}


export interface AuthorizationRequestParam {
  hubUrl: string
  authRealm: string
}

export const setAuthorizationRequest: ActionCreator<AuthorizationRequestParam> = actionCreator<AuthorizationRequestParam>('runtime/authorizationRequest')
export function setAuthorizationRequestHandler(state: WorkerState, authorizationRequest: AuthorizationRequestParam): WorkerState {
  return {
    ...state,
    runtime: {
      ...state.runtime,
      authorizationRequest
    }
  }
}

export const rememberPage: ActionCreator<string> = actionCreator<string>('persistent/rememberPage')
export function rememberPageHandler(state: WorkerState, path: string): WorkerState {
  return {
    ...state,
    persistent: { ...state.persistent, rememberPath: path },
  }
}

export const setLastUpdateDb: ActionCreator<number> = actionCreator<number>('runtime/setLastUpdateDb')
export function setLastUpdateDbHandler(state: WorkerState, timestamp: number): WorkerState {
  return {
    ...state,
    runtime: {...state.runtime, lastUpdateDb: timestamp},
  }
}

export const setCurrentHubUrl: ActionCreator<string> = actionCreator<string>('runtime/setCurrentHub')
export function setCurrentHubUrlHandler(state: WorkerState, currentHubUrl: string): WorkerState {
  return {
    ...state,
    runtime: {
      ...state.runtime,
      currentHubUrl
    }
  }
}

export const setCurrentAuthRealm: ActionCreator<string> = actionCreator<string>('runtime/setAuthRealm')
export function setCurrentAuthRealmHandler(state: WorkerState, currentAuthRealm: string): WorkerState {
  return {
    ...state,
    runtime: {
      ...state.runtime,
      currentAuthRealm
    }
  }
}

export const setCurrentAuthToken: ActionCreator<string> = actionCreator<string>('runtime/setCurrentAuthToken')
export function setCurrentAuthTokenHandler(state: WorkerState, currentAuthToken: string): WorkerState {
  return {
    ...state,
    runtime: {
      ...state.runtime,
      currentAuthToken
    }
  }
}

export interface SetBrandingParam {
  title?: string
  companyName?: string
  username?: string
  backgroundColor?: string
  textColor?: string
  address: string
}

export const setHubBranding: ActionCreator<SetBrandingParam> = actionCreator<SetBrandingParam>('persistent/setHubBranding')
export function setHubBrandingHandler(state: WorkerState, branding: SetBrandingParam): WorkerState {
  return {
    ...state,
    runtime: {
      ...state.runtime,
      branding
    }
  }
}

export interface ToggleFrameParam {
  isFrameDisplayed: boolean
  forceRedirect?: string
  isPerformer?: boolean
}

export const toggleFrame: ActionCreator<ToggleFrameParam> = actionCreator<ToggleFrameParam>('runtime/toggleFrame')
export function toggleFrameHandler(state: WorkerState, payload: ToggleFrameParam): WorkerState {
  return {
    ...state,
    runtime: {
      ...state.runtime,
      isFrameDisplayed: payload.isFrameDisplayed,
      forceRedirect: payload.forceRedirect,
      isPerformer: payload.isPerformer,
    }
  }
}

export const setChannels: ActionCreator<SerializedPaymentChannel[]> = actionCreator<SerializedPaymentChannel[]>('runtime/setChannels')
export function setChannelsHandler(state: WorkerState, channels: SerializedPaymentChannel[]): WorkerState {
  return {
    ...state,
    runtime: {
      ...state.runtime,
      channels: {
        ...state.runtime.channels,
        [state.runtime.currentHubUrl]: channels
      }
    }
  }
}

export const setChannel: ActionCreator<SerializedPaymentChannel> = actionCreator<SerializedPaymentChannel>('runtime/setChannel')
export function setChannelHandler(state: WorkerState, channel: SerializedPaymentChannel): WorkerState {
  let channels = state.runtime.channels[state.runtime.currentHubUrl] || []
  channels = [].concat(channels as any)

  const index = channels.findIndex((ch: SerializedPaymentChannel) => ch.channelId === channel.channelId)

  if (index === -1) {
    channels.push(channel)
  } else {
    channels[index] = channel
  }

  return {
    ...state,
    runtime: {
      ...state.runtime,
      channels: {
        ...state.runtime.channels,
        [state.runtime.currentHubUrl]: channels
      }
    }
  }
}

export const setHistory: ActionCreator<HistoryItem[]> = actionCreator<HistoryItem[]>('runtime/setHistory')
export function setHistoryHandler(state: WorkerState, history: HistoryItem[]): WorkerState {
  return {
    ...state,
    runtime: {
      ...state.runtime,
      history
    }
  }
}

export const setBalance: ActionCreator<string> = actionCreator<string>('runtime/setBalance')
export function setBalanceHandler(state: WorkerState, balance: string): WorkerState {
  return {
    ...state,
    runtime: {
      ...state.runtime,
      balance
    }
  }
}

export const setPendingTransaction: ActionCreator<PendingTransaction|null> = actionCreator<PendingTransaction|null>('runtime/setPendingTransaction')
export function setPendingTransactionHandler(state: WorkerState, pendingTransaction: PendingTransaction|null): WorkerState {
  return {
    ...state,
    runtime: {
      ...state.runtime,
      pendingTransaction
    }
  }
}

export const reset: ActionCreator<null> = actionCreator<null>('runtime/reset')
export function resetHandler(): WorkerState {
  return undefined as any
}

export const setHasActiveWithdrawal: ActionCreator<boolean> = actionCreator<boolean>('runtime/setActiveWithdrawal')
export function setHasActiveWithdrawalHandler(state: WorkerState, hasActiveWithdrawal: boolean): WorkerState {
  return {
    ...state,
    runtime: {
      ...state.runtime,
      hasActiveWithdrawal
    }
  }
}
