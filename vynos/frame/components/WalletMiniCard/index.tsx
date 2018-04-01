import * as React from 'react' // eslint-disable-line no-unused-vars
import * as PropTypes from 'prop-types'
import * as classnames from 'classnames'

const s = require('./styles.css')

const WalletEntryButton: React.SFC<any> = function(props) {
  const {
    className,
    isLocked,
    style,
    onClick,
    balance,
    noAccount,
    loading,
    inverse,
    alwaysLarge,
  } = props

  return (
    <div
      className={classnames(s.container, className, {
        [s.locked]: isLocked,
        [s.unlocked]: !isLocked,
        [s.noAccount]: noAccount,
        [s.loading]: loading,
        [s.inverse]: inverse,
        [s.large]: alwaysLarge,
      })}
      onClick={onClick}
      style={style}
    >
      <div className={s.icon} />
      {
        balance && !noAccount
          ? (
            <div className={s.balance}>
              {getBalance(balance)}
            </div>
          )
          : null
      }
    </div>
  )
}

function getBalance(balance: number): string {
  if (balance > 99) {
    return '$99+'
  }

  if (!(balance % 1)) {
    return `$${balance}`
  }

  if (balance < 10) {
    return `$${balance.toFixed(2)}`
  }

  return `$${balance.toFixed(1)}`
}

WalletEntryButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  isLocked: PropTypes.bool,
  noAccount: PropTypes.bool,
  loading: PropTypes.bool,
  inverse: PropTypes.bool,
  alwaysLarge: PropTypes.bool,
  balance: PropTypes.number,
}

WalletEntryButton.defaultProps = {
  className: '',
  isLocked: false,
  noAccount: false,
  inverse: false,
  balance: 0,
}

export default WalletEntryButton
