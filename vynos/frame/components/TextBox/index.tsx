import * as React from 'react'
import * as classnames from 'classnames'

const s = require('./style.css')

const TextBox: React.SFC<any> = function(props) {
  const { children, className } = props

  return (
    <div className={classnames(s.textbox, className)}>
      {children}
    </div>
  )
}

TextBox.defaultProps = {
  className: '',
}

export default TextBox
