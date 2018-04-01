import * as BigNumber from 'bignumber.js';
import {SharedState} from '../../../worker/WorkerState'
import {SerializedPaymentChannel} from 'machinomy/dist/lib/payment_channel'

export function cardBalance(sharedState: SharedState): BigNumber.BigNumber {
  const hubUrl = sharedState.currentHubUrl
  const channels = sharedState.channels[hubUrl] || []

  return channels.reduce((acc: BigNumber.BigNumber, curr: SerializedPaymentChannel) => {
    const remaining = new BigNumber.BigNumber(curr.value).minus(curr.spent)
    return acc.plus(remaining)
  }, new BigNumber.BigNumber(0))
}
