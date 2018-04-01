import * as redux from 'redux'
import {Reducer} from 'redux'
import {reducerWithInitialState} from "typescript-fsa-reducers";
import {FrameState, initialState} from "./FrameState";
import * as actions from './actions'
import {topmenu} from './menu'
import WorkerProxy from "../WorkerProxy";

export default function reducers(workerProxy: WorkerProxy): Reducer<FrameState> {
  const state = initialState(workerProxy)

  const tempReducer = reducerWithInitialState(state.temp)
    .case(actions.didReceiveMnemonic, actions.didReceiveMnemonicHandler)
    .case(actions.didStoreMnemonic, actions.didStoreMnemonicHandler)
    .case(actions.didAcknowledgeDeposit, actions.didAcknowledgeDepositHandler)
    .case(actions.setWorkerProxy, actions.setWorkerProxyHandler)

  const sharedReducer = reducerWithInitialState(state.shared)
    .case(actions.setSharedState, actions.setSharedStateHandler)
    .case(actions.setPending, actions.setPendingHandler)

  const walletReducer = reducerWithInitialState(state.wallet)
    .case(actions.updateBalance, actions.updateBalanceHandler)
    .case(actions.updateAddress, actions.updateAddressHandler)

  return redux.combineReducers({
    temp: tempReducer,
    shared: sharedReducer,
    menu: topmenu,
    wallet: walletReducer,
  });
}
