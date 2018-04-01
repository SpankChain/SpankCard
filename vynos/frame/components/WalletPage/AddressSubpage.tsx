import * as React from 'react'
import { Container, Menu, Form, Button, Divider } from 'semantic-ui-react'
import * as qr from 'qr-image'

const style = require('../../styles/ynos.css')

export interface AddressSubpageProps {
  address: string
}

export interface AddressSubpageState {
  copyToClipboardText: string
}

function etherscanLink(hexAddress: string): string {
  return `https://ropsten.etherscan.io/address/${hexAddress}` // FIXME Networks
}

const LABEL_COPY_TO_CLIPBOARD = 'Copy to Clipboard'
const LABEL_COPIED = 'Copied'

export default class AddressSubpage extends React.Component<AddressSubpageProps, AddressSubpageState> {
  constructor (props: AddressSubpageProps) {
    super(props)
    this.state = {
      copyToClipboardText: LABEL_COPY_TO_CLIPBOARD
    }
  }

  didCopy () {
    this.setState({
      copyToClipboardText: LABEL_COPIED
    })
    setTimeout(() => {
      this.setState({
        copyToClipboardText: LABEL_COPY_TO_CLIPBOARD
      })
    }, 1200)
  }

  renderQR () {
    let pngBuffer = qr.imageSync(this.props.address, {type: 'png', margin: 1}) as Buffer
    let dataURI = 'data:image/png;base64,' + pngBuffer.toString('base64')
    return <img className='react-qr' src={dataURI} />
  }

  render () {
    return <div className={style.walletAddressSubpage}>
      <div className={style.walletAddressSubpageButtons}>
        <div className={style.walletAddressSubpageButtonsSingle}>
          <Button type="submit" content="Refill" className={style.buttonNav} disabled />
        </div>
        <div className={style.walletAddressSubpageButtonsSingle}>
          <Button type="submit" content="Send" className={style.buttonNav} disabled />
        </div>
      </div>
      <Divider hidden />
      <p className={style.walletAddressSubpageParagraph}>
        {this.props.address}
      </p>
      <p className={style.walletAddressSubpageParagraph}>
        <a href={etherscanLink(this.props.address)} target="_blank">View on Etherscan</a>
      </p>
      <Divider hidden />
      <p className={style.walletAddressSubpageParagraph}>
        {this.renderQR()}
      </p>
    </div>
  }
}
