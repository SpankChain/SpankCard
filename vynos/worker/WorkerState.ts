import Wallet from 'ethereumjs-wallet'
import {SerializedPaymentChannel} from 'machinomy/dist/lib/payment_channel'
import Payment from 'machinomy/dist/lib/payment'

export interface RuntimeState {
  wallet?: Wallet
  isTransactionPending: number
  lastUpdateDb: number
  currentHubUrl: string
  currentAuthRealm: string
  currentAuthToken: string
  authorizationRequest: AuthorizationRequestState|null
  isFrameDisplayed: boolean
  isPerformer?: boolean
  forceRedirect?: string
  branding: BrandingState
  channels: ChannelsState
  history: HistoryItem[]
  balance: string
  pendingTransaction: PendingTransaction|null
  hasActiveWithdrawal: boolean
}

export interface AuthorizationRequestState {
  hubUrl: string
  authRealm: string
}

export interface ChannelsState {
  [hubUrl: string]: SerializedPaymentChannel[]
}

export interface HistoryItem {
  payment: { channelId: string, sender: string, price: string }
  [key: string]: any
}

export interface PendingTransaction {
  amount: string
  hash: string
}

export interface SharedState {
  didInit: boolean
  isLocked: boolean
  isTransactionPending: number
  rememberPath: string
  lastUpdateDb: number
  currentHubUrl: string
  currentAuthToken: string
  currentAuthRealm: string
  authorizationRequest: AuthorizationRequestState|null
  isFrameDisplayed: boolean
  forceRedirect?: string
  isPerformer?: boolean
  branding: BrandingState
  channels: ChannelsState
  history: HistoryItem[]
  balance: string
  pendingTransaction: PendingTransaction|null
  address: string|null
  hasActiveWithdrawal: boolean
  pendingChannelIds: string[]
}

export interface PersistentState {
  didInit: boolean,
  keyring?: string,
  rememberPath: string
  pendingChannelIds: string[]
}

export interface BrandingState {
  title?: string
  companyName?: string
  username?: string
  backgroundColor?: string
  textColor?: string
  address: string
}

export interface WorkerState {
  persistent: PersistentState,
  runtime: RuntimeState
}

export const INITIAL_SHARED_STATE: SharedState = {
  didInit: false,
  isLocked: true,
  isTransactionPending: 0,
  rememberPath: '/',
  lastUpdateDb: 0,
  authorizationRequest: null,
  currentHubUrl: '',
  currentAuthRealm: '',
  currentAuthToken: '',
  isFrameDisplayed: false,
  isPerformer: false,
  branding: {
    address: ''
  },
  channels: {},
  history: [],
  balance: '0',
  pendingTransaction: null,
  address: null,
  hasActiveWithdrawal: false,
  pendingChannelIds: []
}

export const INITIAL_STATE: WorkerState = {
  persistent: {
    didInit: false,
    rememberPath: '/',
    pendingChannelIds: []
  },
  runtime: {
    isTransactionPending: 0,
    lastUpdateDb: 0,
    currentHubUrl: '',
    currentAuthRealm: '',
    currentAuthToken: '',
    authorizationRequest: null,
    isFrameDisplayed: false,
    isPerformer: false,
    forceRedirect: undefined,
    branding: {
      address: ''
    },
    channels: {},
    history: [],
    balance: '0',
    pendingTransaction: null,
    hasActiveWithdrawal: false,
  },
}

export function buildSharedState(state: WorkerState): SharedState {
  return {
    didInit: state.persistent.didInit,
    isLocked: !state.runtime.wallet,
    isTransactionPending: state.runtime.isTransactionPending,
    rememberPath: state.persistent.rememberPath,
    lastUpdateDb: state.runtime.lastUpdateDb,
    currentHubUrl: state.runtime.currentHubUrl,
    currentAuthRealm: state.runtime.currentAuthRealm,
    currentAuthToken: state.runtime.currentAuthToken,
    authorizationRequest: state.runtime.authorizationRequest,
    isFrameDisplayed: state.runtime.isFrameDisplayed,
    forceRedirect: state.runtime.forceRedirect,
    isPerformer: state.runtime.isPerformer,
    branding: state.runtime.branding,
    channels: state.runtime.channels,
    history: state.runtime.history,
    balance: state.runtime.balance,
    pendingTransaction: state.runtime.pendingTransaction,
    address: state.runtime.wallet ? state.runtime.wallet.getAddressString() : null,
    hasActiveWithdrawal: state.runtime.hasActiveWithdrawal,
    pendingChannelIds: state.persistent.pendingChannelIds
  }
}
