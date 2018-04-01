import * as React from 'react'
import Button from '../../../components/Button/index'

const s = require('./index.css')

export interface Props {
  to?: string
}

export default class WalletCTAButton extends React.Component<Props> {
  render() {
    return (
      <div className={s.container}>
        <Button
          to={this.props.to}
          content="Go Back to SpankCard"
        />
      </div>
    )
  }
}
