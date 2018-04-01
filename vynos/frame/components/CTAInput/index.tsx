import * as React from 'react'
import * as classnames from 'classnames'

const s = require('./style.css')

const CTAInput: React.SFC<any> = function(props) {
  const {
    className,
    ctaInputValueClass,
    ctaContentClass,
    checked,
    onChange,
    value,
    ctaContent,
    isInverse,
    isConnected,
  } = props

  return (
    <div className={classnames(className, s.ctaInput, {
      [s.inverse]: isInverse,
      [s.connected]: isConnected,
    })}>
      <div className={classnames(s.ctaInputValue, ctaInputValueClass)}>
        {value}
      </div>
      <div className={classnames(s.ctaInputText, ctaContentClass)}>
        {ctaContent()}
      </div>
    </div>
  )
}

CTAInput.defaultProps = {
  className: '',
  ctaContentClass: '',
  ctaInputValueClass: '',
  checked: null,
  onChange() {},
  isInverse: false,
}

export default CTAInput
