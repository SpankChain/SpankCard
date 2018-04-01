import * as React from 'react'
import * as classnames from 'classnames'

const s = require('./style.css')

const Input: React.SFC<any> = function(props) {
  const {
    type,
    className,
    disabled,
    placeholder,
    onChange,
    onBlur,
    errorMessage,
    value,
    onKeyDown,
    autoFocus,
    inverse,
  } = props

  return (
    <div className={classnames(s.wrapper, className)}>
      <input
        type={type}
        className={classnames(s.input, {
          [s.error]: errorMessage,
        })}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
      />
      <div className={classnames(s.errorMessage, {
        [s.inverse]: inverse
      })}>{errorMessage}</div>
    </div>
  )
}

Input.defaultProps = {
  type: 'text',
  className: '',
  disabled: false,
  autoFocus: false
}

export default Input
