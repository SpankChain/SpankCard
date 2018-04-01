import * as React from 'react';
import classNames = require('classnames')

const s = require('./style.css')

export interface XButtonProps {
 onClick: () => void
}

export default class XButton extends React.Component<XButtonProps, {}> {
  render() {
    return (
      <div className={s.xButton} onClick={this.props.onClick} />
    )
  }
}
