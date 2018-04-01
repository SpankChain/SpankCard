import * as React from "react"
import Web3 = require('web3')
import {connect} from "react-redux"
import {Dispatch} from 'redux'
import * as classnames from 'classnames'
import * as copy from 'copy-to-clipboard'
import * as qr from 'qr-image'
import {FrameState} from "../../redux/FrameState"
import WorkerProxy from "../../WorkerProxy"
import * as actions from "../../redux/actions"
import Button from "../../components/Button/index"
import CTAInput from "../../components/CTAInput/index"
import OnboardingContainer from './OnboardingContainer'

const style = require('../../styles/ynos.css')
const d = require('./Deposit.css')

export interface DepositStateProps {
  web3?: Web3
  workerProxy: WorkerProxy
}

export interface DepositStates {
  address: string
  isAuthenticating: boolean
  isCopied: boolean
}

export type DepositProps = DepositStateProps & DepositDispatchProps

export interface DepositDispatchProps {
  didAcknowledgeDeposit: () => void
}

export class Deposit extends React.Component<DepositProps, DepositStates> {
  timeout: any
  
  state = {
    address: '',
    isAuthenticating: false,
    isCopied: false,
  }

  handleSubmit = async () => {
    this.setState({
      isAuthenticating: true
    })

    await this.props.didAcknowledgeDeposit()
    await this.props.workerProxy.authenticate()
  }

  componentDidMount() {
    const { web3 } = this.props
    if (web3) {
      web3.eth.getAccounts((err: any, accounts: any) => {
        let address = accounts[0]
        this.setState({ address })
      })
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }

  onCopyAddress = () => {
    const { address } = this.state;

    if (address) {
      copy(address)
      this.setState({
        isCopied: true,
      })

      this.timeout = setTimeout(() => {
        this.setState({ isCopied: false })
      }, 2000)
    }
  }

  renderQR () {
    let pngBuffer = qr.imageSync(this.state.address, {type: 'png', margin: 1}) as Buffer
    let dataURI = 'data:image/png;base64,' + pngBuffer.toString('base64')
    return <img className={classnames('react-qr', style.qrCode)} src={dataURI} />
  }

  render () {
    return (
      <OnboardingContainer totalSteps={4} currentStep={2}>
        <div className={style.content}>
          <div className={style.funnelTitle}>Transfer Funds</div>
          <div className={style.seedPhraseText}>
            This is your SpankWallet address. You can copy it and send crypto from any exchange.
          </div>
          <CTAInput
            className={style.ctaInput}
            ctaInputValueClass={d.ctaInputValue}
            ctaContentClass={d.ctaInputContent}
            value={this.state.address}
            ctaContent={() => (
              <div className={style.ctaContentWrapper} onClick={this.onCopyAddress}>
                <div className={style.ctaIcon} />
                <span className={style.ctaText}>
                  {this.state.isCopied ? 'Copied' : 'Copy'}
                </span>
              </div>
            )}
          />
          <div className={style.mnemonicWarning}>
            Only send Ether (ETH) to this address.
          </div>
          <div className={style.mnemonicFooter}>
            <Button
              type="secondary"
              content="Back"
              isInverse
            />
            <Button
              content="Next"
              isInverse
              onClick={this.handleSubmit}
            />
          </div>
        </div>
        {this.renderQR()}
      </OnboardingContainer>
    )
  }
}

function mapStateToProps(state: FrameState): DepositStateProps {
  return {
    web3: state.temp.workerProxy.web3,
    workerProxy: state.temp.workerProxy,
  }
}

function mapDispatchToProps(dispatch: Dispatch<FrameState>): DepositDispatchProps {
  return {
    didAcknowledgeDeposit: () => dispatch(actions.didAcknowledgeDeposit(''))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Deposit)
