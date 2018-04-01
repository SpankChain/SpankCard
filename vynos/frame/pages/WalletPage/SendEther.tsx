import * as React from 'react'
import {ChangeEvent} from 'react'
import {connect} from 'react-redux'
import {FrameState} from '../../redux/FrameState'
import Input from '../../components/Input/index'
import Button from '../../components/Button/index'
import Currency, {CurrencyType} from '../../components/Currency/index'
import Web3 = require('web3')
import * as BigNumber from 'bignumber.js';
import WorkerProxy from '../../WorkerProxy'
import {PendingTransaction} from '../../../worker/WorkerState'

const s = require('./SendEther.css')
const utils = require('web3-utils')

export interface MapStateToProps {
  workerProxy: WorkerProxy
  walletAddress: string | null
  walletBalance: string | null
  pendingTransaction: PendingTransaction | null
}

export interface MapDispatchToProps {

}

export interface OwnProps {
  history: any
}

export type SendEtherProps = MapStateToProps & MapDispatchToProps & OwnProps

export interface SendEtherState {
  addressError: string
  balanceError: string
  address: string
  balance: string
  isAddressDirty: boolean
  isBalanceDirty: boolean
  disableSend: boolean
  isConfirming: boolean
  isAdjustingGas: boolean
  gasPrice: string
  gas: string
}

export class SendEther extends React.Component<SendEtherProps, SendEtherState> {
  constructor (props: SendEtherProps) {
    super(props)
    this.state = {
      balance: '',
      balanceError: '',
      isBalanceDirty: false,
      address: '',
      addressError: '',
      isAddressDirty: false,
      disableSend: false,
      isConfirming: false,
      isAdjustingGas: false,
      gasPrice: '40',
      gas: '53000',
    }

    this.onSendTransaction = this.onSendTransaction.bind(this)
    this.confirm = this.confirm.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  componentWillMount() {
    this.getGas()
  }

  getGas() {
    const {
      eth: { estimateGas, getGasPrice },
      fromWei,
    } = this.props.workerProxy.web3

    estimateGas({}, (err, data) => {
      if (err) {
        return
      }

      this.setState({ gas: '' + data })
    })

    getGasPrice((err, data) => {
      if (err) {
        return
      }

      this.setState({
        gasPrice: '' + fromWei(data.toNumber(), 'gwei'),
      })
    })
  }

  validateBalance = () => {
    const {walletBalance} = this.props
    const {balance, isBalanceDirty} = this.state

    if (!isBalanceDirty || !walletBalance) {
      return false
    }

    if (!balance) {
      this.setState({
        balanceError: 'Balance cannot be empty'
      })
      return false
    }

    if (!Number(balance)) {
      this.setState({
        balanceError: 'Balance cannot be 0'
      })
      return false
    }

    if (walletBalance < balance) {
      this.setState({
        balanceError: 'You do not have enough ether'
      })
      return false
    }

    return true
  }

  validateAddress = () => {
    const {walletAddress} = this.props
    const {address, isAddressDirty} = this.state
    const {isAddress} = utils

    if (!isAddressDirty) {
      return false
    }

    if (!address) {
      this.setState({
        addressError: 'Address cannot be empty'
      })
      return false
    }

    if (!isAddress(address)) {
      this.setState({
        addressError: 'Address is invalid'
      })
      return false
    }

    if (walletAddress === address) {
      this.setState({
        addressError: 'Address is the same as your own wallet address'
      })
      return false
    }

    return true
  }

  onBalanceChange = (e: ChangeEvent<EventTarget>) => {
    this.setState({
      balance: (e.target as HTMLInputElement).value,
      balanceError: '',
      isBalanceDirty: true
    })
  }

  onAddressChange = (e: ChangeEvent<EventTarget>) => {
    this.setState({
      address: (e.target as HTMLInputElement).value,
      addressError: '',
      isAddressDirty: true
    })
  }

  onGasChange = (e: ChangeEvent<EventTarget>) => {
    this.setState({ gas: (e.target as HTMLInputElement).value })
  }

  onGasPriceChange = (e: ChangeEvent<EventTarget>) => {
    this.setState({ gasPrice: (e.target as HTMLInputElement).value })
  }

  async onSendTransaction() {
    const {address, balance, gas, gasPrice} = this.state

    this.setState({
      disableSend: true
    })

    try {
      await this.props.workerProxy.send(
        address,
        this.props.workerProxy.web3.toWei(balance, 'finney'),
        gas,
        this.props.workerProxy.web3.toWei(gasPrice, 'gwei')
      )
    } catch (e) {
      console.error(e)
      return
    }

    this.setState({
      balance: '',
      balanceError: '',
      isBalanceDirty: false,
      address: '',
      addressError: '',
      isAddressDirty: false,
      disableSend: false
    }, () => {
      this.props.history.push('/wallet')
    })
  }

  confirm () {
    const validAddress = this.validateAddress()
    const validBalance = this.validateBalance()

    if (!validAddress || !validBalance) {
      return
    }

    this.setState({
      isConfirming: true
    })
  }

  cancel () {
    this.setState({
      isConfirming: false
    })
  }

  renderAdjustGas() {
    const { gas, gasPrice } = this.state

    return (
      <div>
        <div className={s.header}>Adjust Gas Price and Gas Limit</div>
        <div className={s.contentRow}>
          <div className={s.inputWrapper}>
            <div className={s.inputLabel}>Gas Price</div>
            <Input
              className={s.input}
              type="number"
              placeholder="4"
              value={gasPrice}
              onChange={this.onGasPriceChange}
            />
          </div>
        </div>
        <div className={s.contentRow}>
          <div className={s.inputWrapper}>
            <div className={s.inputLabel}>Gas Limit</div>
            <Input
              className={s.input}
              type="number"
              placeholder="53,000"
              value={gas}
              onChange={this.onGasChange}
            />
            <div className={s.gasText}>
              We calculate the suggested gas price/limit based on network success rates.
            </div>
          </div>
        </div>
        <div className={s.footer}>
          <Button
            type="secondary"
            className={s.adjustGasButton}
            content="Cancel"
            onClick={() => {
              this.setState({ isAdjustingGas: false })
              this.getGas()
            }}
          />
          <Button
            onClick={() => this.setState({ isAdjustingGas: false })}
            content="Confirm"
          />
        </div>
      </div>
    )
  }

  renderContent() {
    if (this.props.pendingTransaction) {
      return this.renderPendingContent()
    }

    if (this.state.isAdjustingGas) {
      return this.renderAdjustGas()
    }

    return this.renderNormalContent()
  }

  render () {
    return (
      <div className={s.container}>
        {this.renderContent()}
      </div>
    )
  }

  renderNormalContent () {
    const { addressError, balanceError, isConfirming, address, balance } = this.state
    const { web3 } = this.props.workerProxy

    return (
      <div>
        <div className={s.header}>Send Ether</div>
        <div className={s.contentRow}>
          <div className={s.inputWrapper}>
            <div className={s.inputLabel}>Address</div>
            <Input
              className={s.input}
              placeholder="0x3930DdDf234..."
              onChange={this.onAddressChange}
              errorMessage={addressError}
              disabled={isConfirming}
              value={address}
            />
          </div>
        </div>
        <div className={s.contentRow}>
          <div className={s.inputWrapper}>
            <div className={s.inputLabel}>Finney Amount</div>
            <Input
              className={s.input}
              type="number"
              placeholder="0.00"
              onChange={this.onBalanceChange}
              errorMessage={balanceError}
              disabled={isConfirming}
              value={balance}
            />
          </div>
          <div className={s.inputResult}>
            <div className={s.inputEqual}>=</div>
            <div className={s.inputTotal}>
              <Currency
                amount={web3.toWei(new BigNumber.BigNumber(this.state.balance || 0), 'finney')}
                inputType={CurrencyType.WEI}
                showUnit={true}
              />
            </div>
          </div>
        </div>
        {isConfirming ? this.renderConfirmingFooter() : this.renderNormalFooter()}
      </div>
    )
  }

  renderPendingContent () {
    const { hash } = this.props.pendingTransaction!

    return (
      <div>
        <div className={s.header}>Withdrawing From Wallet</div>
        <div className={s.contentRow}>
          <div className={s.spinnerWrapper}>
            <div className={s.spinner} />
            Pending
          </div>
        </div>
        <div className={s.contentRow}>
          <div className={s.small}>
            Transaction ID <br /> {hash}
          </div>
        </div>
        <div className={s.footer}>
          <Button
            type="tertiary"
            onClick={() => this.props.workerProxy.toggleFrame(false)}
            content="Close Window"
          />
          <Button
            content="View Transaction"
            type="dark"
            to={`https://etherscan.io/tx/${hash}`}
          />
        </div>
      </div>
    )
  }

  renderNormalFooter () {
    const {addressError, balanceError, disableSend } = this.state
    const { walletAddress } = this.props

    return (
      <div className={s.footer}>
        <Button
          type="secondary"
          className={s.adjustGasButton}
          onClick={() => this.setState({ isAdjustingGas: true })}
          content="Adjust Gas Limit/Price"
        />
        <Button
          content="Next"
          onClick={this.confirm}
          disabled={!!addressError || !!balanceError || disableSend || !walletAddress}
        />
      </div>
    )
  }

  renderConfirmingFooter () {
    return (
      <div className={s.footer}>
        <Button
          type="tertiary"
          content="Cancel"
          onClick={this.cancel}
        />
        <Button
          content="Confirm"
          type="dark"
          onClick={this.onSendTransaction}
        />
      </div>
    )
  }
}

function mapStateToProps (state: FrameState): MapStateToProps {
  return {
    workerProxy: state.temp.workerProxy,
    walletAddress: state.shared.address,
    walletBalance: state.shared.balance,
    pendingTransaction: state.shared.pendingTransaction
  }
}

export default connect(mapStateToProps)(SendEther)
