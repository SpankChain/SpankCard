import Transaction from './TransactionMeta'
import {randomId} from './Payload'
import TransactionKind from './TransactionKind'
import TransactionState from './TransactionState'

export function ethereum(id: string, to: string, amount: number, fee: number): Transaction {
  return {
    id: randomId().toString(),
    title: 'Ethereum',
    to,
    time: Date.now(),
    amount,
    fee,
    kind: TransactionKind.ETHEREUM,
    state: TransactionState.PENDING,
  }
}

export function signature(from: string, data: string): Transaction {
  return {
    id: randomId().toString(),
    title: 'Signature',
    from,
    data,
    time: Date.now(),
    amount: 0,
    fee: 0,
    kind: TransactionKind.SIGN,
    state: TransactionState.PENDING,
  }
}
