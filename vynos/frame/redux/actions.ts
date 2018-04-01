import actionCreatorFactory, {ActionCreator} from 'typescript-fsa'
import {SharedState} from '../../worker/WorkerState'
import {Store} from 'redux'
import {FrameState, TempState, WalletState} from './FrameState'
import WorkerProxy from "../WorkerProxy";

const actionCreator = actionCreatorFactory("frame");

export const setSharedState: ActionCreator<SharedState> = actionCreator<SharedState>("shared/setSharedState");
export function setSharedStateHandler(state: SharedState, sharedState: SharedState): SharedState {
  return sharedState
}

export const setPending: ActionCreator<boolean> = actionCreator<boolean>("shared/setPending");
export function setPendingHandler(state: SharedState, isTransactionPending: boolean): SharedState {
  let pendingDate = 0
  if (isTransactionPending) {
    pendingDate = Date.now()
  }
  return { ...state, isTransactionPending: pendingDate}
}

export const didReceiveMnemonic: ActionCreator<string> = actionCreator<string>("temp/didReceiveMnemonic");
export function didReceiveMnemonicHandler(state: TempState, mnemonic: string): TempState {
  return { ...state, initPage: { ...state.initPage, mnemonic: mnemonic }}
}

export const didStoreMnemonic: ActionCreator<string> = actionCreator<string>("temp/didStoreMnemonic");
export function didStoreMnemonicHandler(state: TempState, mnemonic: string): TempState {
  return { ...state, initPage: { ...state.initPage, showInitialDeposit: true }}
}

export const didAcknowledgeDeposit: ActionCreator<string> = actionCreator<string>("temp/didAcknowledgeDeposit");
export function didAcknowledgeDepositHandler(state: TempState, mnemonic: string): TempState {
  return { ...state, initPage: { ...state.initPage, mnemonic: null, showInitialDeposit: false }}
}

export const setWorkerProxy: ActionCreator<WorkerProxy> = actionCreator<WorkerProxy>("temp/setWorkerProxy")
export function setWorkerProxyHandler(state: TempState, workerProxy: WorkerProxy): TempState {
  return { ...state, workerProxy: workerProxy }
}

// Wallet actions
export const updateBalance: ActionCreator<string> = actionCreator<string>("wallet/updateBalance");
export function updateBalanceHandler(state: WalletState, balance: string): WalletState {
  return {
    ...state,
    main: {
      ...state.main,
      balance,
    },
  }
}

export const updateAddress: ActionCreator<string> = actionCreator<string>("wallet/updateAddress");
export function updateAddressHandler(state: WalletState, address: string): WalletState {
  return {
    ...state,
    main: {
      ...state.main,
      address,
    },
  }
}
