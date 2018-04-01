import * as React from 'react';
import * as BigNumber from 'bignumber.js'
import * as classnames from 'classnames'
import WorkerProxy from '../../WorkerProxy'
import {FrameState} from '../../redux/FrameState'
import {connect} from 'react-redux'
import FinneySign from '../FinneySign/index'

const s = require('./style.css')

export enum CurrencyType {
  USD,
  ETH,
  WEI,
  FINNEY
}

export interface StateProps {
  workerProxy: WorkerProxy
}

export interface CurrencyProps extends StateProps {
  amount: BigNumber.BigNumber
  decimals?: number
  outputType?: CurrencyType.ETH | CurrencyType.USD | CurrencyType.FINNEY
  inputType?: CurrencyType.ETH | CurrencyType.WEI
  showUnit?: boolean
  unitClassName?: string
  className?: string
}

export class Currency extends React.Component<CurrencyProps, any> {
  public static defaultProps: Partial<CurrencyProps> = {
    decimals: 2,
    outputType: CurrencyType.USD,
    inputType: CurrencyType.WEI,
    showUnit: false
  }

  render() {
    const {
      amount,
      decimals,
      inputType,
      outputType,
      showUnit,
      unitClassName,
      className,
    } = this.props

    let ret
    if (inputType === outputType) {
      ret = new BigNumber.BigNumber(amount).toFixed(decimals).toString()
    } else if (outputType === CurrencyType.USD) {
      const eth = inputType === CurrencyType.ETH
        ? amount
        : new BigNumber.BigNumber(this.props.workerProxy.web3.fromWei(amount, 'ether'))

      ret = eth.mul(880).toFixed(decimals).toString()
    } else if (outputType === CurrencyType.FINNEY) {
      const finney = new BigNumber.BigNumber(this.props.workerProxy.web3.fromWei(amount, 'finney'))
      ret = finney.toNumber().toFixed(decimals).toString()
    } else {
      ret = this.props.workerProxy.web3.fromWei(amount, 'ether').toFixed(decimals).toString()
    }

    return (
      <span className={classnames(s.currency, className)}>
        {renderUnit(showUnit, outputType, unitClassName)} {ret}
      </span>
    )
  }
}

function renderUnit(showUnit?: boolean, outputType?: CurrencyType, unitClassName?: string) {
  if (!showUnit) {
    return ''
  }

  if (outputType === CurrencyType.USD) {
    return '$'
  }

  if (outputType === CurrencyType.FINNEY) {
    return <FinneySign className={unitClassName}/>
  }

  return ''
}

function mapStateToProps (state: FrameState, ownProps: any): StateProps {
  return {
    workerProxy: state.temp.workerProxy
  }
}

export default connect(mapStateToProps)(Currency)
