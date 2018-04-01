import * as React from "react"
import {connect} from 'react-redux'
import * as classnames from "classnames"
import WorkerProxy from '../../WorkerProxy'
import {FrameState} from '../../redux/FrameState'
import WalletCard from "../../components/WalletCard/index"
import WalletMiniCard from "../../components/WalletMiniCard/index"
import XButton from '../../components/XButton/index'
const s = require('./OnboardingContainer.css')

export interface MapStateToProps {
  workerProxy: WorkerProxy
}

export interface OwnProps {
  children?: any
  totalSteps: number
  currentStep: number
  headerText?: string
}

export type Props = MapStateToProps & OwnProps

export class OnboardingContainer extends React.Component<Props> {

  closeView = () => {
    this.props.workerProxy.toggleFrame(false)
  }

  renderProgressDots() {
    const { totalSteps, currentStep } = this.props
    const steps = []

    for (let i = 0; i < totalSteps; i++) {
      if (i > 0) {
        steps.push(
          <div
            className={classnames(s.line, {
              [s.activeLine]: i <= currentStep,
            })}
            key={`${i}-line`}
          />
        )
      }

      steps.push(
        <div
          className={classnames(s.dot, {
            [s.activeDot]: i <= currentStep,
          })}
          key={`${i}-dot`}
        />
      )
    }

    return (
      <div
        className={s.progressDots}>
          {steps}
      </div>
    )
  }

  renderHeaderText() {
    return this.props.headerText
      ? <div className={s.headerText}>{this.props.headerText}</div>
      : null
  }

  render() {
    return (
      <div className={s.container}>
        <div className={s.header}>
          {this.renderHeaderText()}
          {this.renderProgressDots()}
          <XButton onClick={this.closeView} />
        </div>
        <WalletCard
          width={275}
          cardTitle="SpankCard"
          companyName="SpankChain"
          name="spanktoshi"
          className={s.funnelWalletCard}
        />
        {this.props.children}
      </div>
    )
  }

}

function mapStateToProps(state: FrameState, ownProps: OwnProps): MapStateToProps {
  return {
    workerProxy: state.temp.workerProxy,
  }
}

export default connect(mapStateToProps)(OnboardingContainer)
