import {INITIAL_SHARED_STATE, SharedState} from '../../worker/WorkerState'
import WorkerProxy from '../WorkerProxy'

export interface InitPageState {
  mnemonic: string|null
  showInitialDeposit: boolean
}

export interface TempState {
  workerProxy: WorkerProxy
  initPage: InitPageState
}

export interface WalletMainState {
  address: string|null
  balance: string|null
}

export interface WalletState {
  main: WalletMainState
}

export interface FrameState {
  temp: TempState
  shared: SharedState
  wallet: WalletState
}

export function initialState(workerProxy: WorkerProxy): FrameState {
  return {
    temp: {
      initPage: {
        mnemonic: null,
        showInitialDeposit: false,
      },
      workerProxy: workerProxy
    },
    shared: INITIAL_SHARED_STATE,
    wallet: {
      main: {
        address: null,
        balance: null,
      },
    },
  }
}
