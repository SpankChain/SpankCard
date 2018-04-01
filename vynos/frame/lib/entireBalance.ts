import * as BigNumber from 'bignumber.js';
import WorkerProxy from '../WorkerProxy'

export default async function entireBalance(workerProxy: WorkerProxy, walletBalance: BigNumber.BigNumber) {
  const gasPrice = await getGasPrice(workerProxy)
  const gasCost = gasPrice.times(300000)
  return walletBalance.minus(gasCost)
}

function getGasPrice (workerProxy: WorkerProxy): Promise<BigNumber.BigNumber> {
  return new Promise((resolve, reject) => workerProxy.web3.eth.getGasPrice((err: any, data: BigNumber.BigNumber) => {
    return err ? reject(err): resolve(data)
  }))
}
