import * as React from 'react'
import CTAInput from '../../components/CTAInput/index'
import Button from '../../components/Button/index'
import WalletCard from '../../components/WalletCard/index'
import {FrameState} from '../../redux/FrameState'
import {connect} from 'react-redux'
import {BrandingState} from '../../../worker/WorkerState'
import {cardBalance} from '../../redux/selectors/cardBalance'
import * as BigNumber from 'bignumber.js';
import WorkerProxy from '../../WorkerProxy'
import Currency, {CurrencyType} from '../../components/Currency/index'
import entireBalance from '../../lib/entireBalance'

const s = require('./styles.css')

export interface StateProps extends BrandingState {
  walletBalance: string
  cardBalance: BigNumber.BigNumber
  isWithdrawing: boolean
  workerProxy: WorkerProxy
}

export interface CardPageState {
  isRefilling: boolean
  error: string
}

class CardPage extends React.Component<StateProps, CardPageState> {
  constructor (props: StateProps) {
    super(props)

    this.state = {
      isRefilling: false,
      error: ''
    }
  }

  async componentDidMount() {
    await this.props.workerProxy.populateChannels()
  }

  async onClickWithdraw () {
    try {
      await this.props.workerProxy.closeChannelsForCurrentHub()
    } catch (e) {
      this.setState({
        error: 'Withdrawal failed. Please try again.',
      })
    }
  }

  async onClickRefill () {
    this.setState({
      isRefilling: true
    })

    const amount = await entireBalance(this.props.workerProxy, new BigNumber.BigNumber(this.props.walletBalance!))

    try {
      await this.props.workerProxy.deposit(amount)
    } catch (e) {
      this.setState({
        isRefilling: false,
        error: e.code === -32603
          ? 'Insufficient funds. Please deposit more ETH.'
          : 'Failed to load up SpankCard. Please try again.'
      })
      return
    }

    this.setState({
      isRefilling: false
    })
  }

  render() {
    const { walletBalance, cardBalance } = this.props;

    return (
      <div className={s.walletSpankCardWrapper}>
        <div className={s.walletRow}>
          <div className={s.walletFundsHeader}>Wallet Funds</div>
          <div className={s.walletRowBalanceWrapper}>
            <CTAInput
              isInverse
              isConnected
              value={(
                <Currency
                  amount={walletBalance}
                  inputType={CurrencyType.WEI}
                  outputType={CurrencyType.FINNEY}
                  className={s.sendReceiveCurrency}
                  unitClassName={s.finneyUnit}
                  showUnit={true}
                />
              )}
              className={s.spankCardCta}
              ctaInputValueClass={s.spankCardCtaInputValue}
              ctaContentClass={s.spankCardCtaContent}
              ctaContent={() => (
                <div className={s.ctaContentWrapper} onClick={() => this.onClickRefill()}>
                  <div className={s.ctaDivider} />
                  <span className={s.ctaText}>{this.state.isRefilling ? 'Refilling...' : 'Load Up SpankCard' }</span>
                </div>
              )}
            />
          </div>
          <div className={s.walletRowAction}>
            <Button to="/card/to/wallet" type="tertiary" content="More" />
          </div>
        </div>
        <div className={s.walletSpankCardContent}>
          {this.renderError()}
          <div className={s.walletSpankCardDetails}>
            <div className={s.walletSpankCardView}>
              <WalletCard
                width={275}
                cardTitle={this.props.title}
                companyName={this.props.companyName}
                name={this.props.username}
                backgroundColor={this.props.backgroundColor}
                color={this.props.textColor}
                currencyValue={cardBalance}
                className={s.walletSpankCard}
              />
            </div>
            <div className={s.walletSpankCardActions}>
              <Button
                type="secondary"
                content={this.props.isWithdrawing ? 'Withdrawing...' : 'Withdraw to Wallet'}
                disabled={this.props.isWithdrawing}
                onClick={() => this.onClickWithdraw()}
                isMini
              />
              <Button to="/wallet/activity" type="secondary" content="Activity" isMini />
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderError () {
    if (!this.state.error) {
      return null
    }

    return (
      <div className={s.walletSpankCardError}>
        {this.state.error}
      </div>
    )
  }
}

function mapStateToProps (state: FrameState, ownProps: any): StateProps {
  return {
    ...state.shared.branding,
    walletBalance: state.shared.balance,
    cardBalance: cardBalance(state.shared),
    isWithdrawing: state.shared.hasActiveWithdrawal,
    workerProxy: state.temp.workerProxy
  }
}

export default connect(mapStateToProps)(CardPage)
