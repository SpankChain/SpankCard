import * as React from 'react'
import {connect} from 'react-redux'
import SendReceivePage from '../SendReceivePage'
import SpankCardPage from '../CardPage'
import {FrameState} from '../../../redux/FrameState'
import {cardBalance} from '../../../redux/selectors/cardBalance'
import WorkerProxy from '../../../WorkerProxy'
import * as BigNumber from 'bignumber.js'

export interface MapStateToProps {
  address: string
  walletBalance: string
  cardBalance: BigNumber.BigNumber
  workerProxy: WorkerProxy
}

export type Props = MapStateToProps

export interface State {
  isInitializingBalances: boolean
}

export class MainEntry extends React.Component<Props, State> {
  state = {
    isInitializingBalances: true,
  }

  async componentDidMount() {
    await this.props.workerProxy.populateChannels()
    this.setState({ isInitializingBalances: false })
  }

  render() {
    const { cardBalance, address } = this.props
    const { isInitializingBalances } = this.state

    if (!address || isInitializingBalances) {
      return <noscript />
    }

    if (cardBalance.gt(0)) {
      return <SpankCardPage />
    }

    return (
      <SendReceivePage />
    )
  }
}

function mapStateToProps(state: FrameState): MapStateToProps {
  return {
    address: state.shared.address!,
    walletBalance: state.shared.balance!,
    cardBalance: cardBalance(state.shared),
    workerProxy: state.temp.workerProxy,
  }
}

export default connect(
  mapStateToProps
)(MainEntry)
