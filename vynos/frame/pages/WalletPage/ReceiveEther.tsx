import * as React from "react"
import Web3 = require('web3')
import {connect} from "react-redux"
import * as classnames from 'classnames'
import * as copy from 'copy-to-clipboard'
import * as qr from 'qr-image'
import CTAInput from "../../components/CTAInput/index"
import Input from "../../components/Input/index"
import Button from "../../components/Button/index"

const s = require('./ReceiveEther.css')


export interface Props {
  address: string|null
  headerText: string
  descriptionLineOne: string
  descriptionLineTwo: string
  linkText: string
}

export interface State {
  isCopied: boolean
}

function renderQR(address: string|null) {
  if (!address) {
    return null
  }

  let pngBuffer = qr.imageSync(address, {type: 'png', margin: 1}) as Buffer
  let dataURI = 'data:image/png;base64,' + pngBuffer.toString('base64')

  return (
    <img className={s.walletQR} src={dataURI} />
  )
}

export class ReceiveEther extends React.Component<Props, State> {
  timeout: any
  
  state = {
    isCopied: false,
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }

  onCopyAddress = () => {
    const { address } = this.props;

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

  render() {
    const {
      address,
      headerText,
      descriptionLineOne,
      descriptionLineTwo,
      linkText,
    } = this.props;

    return (
      <div className={s.container}>
        <div className={s.header}>{headerText}</div>
        <div className={s.descriptionWrapper}>
          <div className={s.description}>
            {descriptionLineOne}
          </div>
          <div className={s.description}>
            {descriptionLineTwo}
            <span className={s.seeTutorialText}>
              {`${linkText} ->`}
            </span>
          </div>
        </div>
        <div className={s.addressWrapper}>
          <CTAInput
            isInverse
            className={s.ctaInput}
            ctaContentClass={s.ctaInputContent}
            ctaInputValueClass={s.ctaInputValue}
            value={address}
            ctaContent={() => (
              <div className={s.ctaContentWrapper} onClick={this.onCopyAddress}>
                <div className={s.ctaIcon} />
                <span className={s.ctaText}>
                  {this.state.isCopied ? 'Copied': 'Copy'}
                </span>
              </div>
            )}
          />
        </div>
        <div className={s.qrWrapper}>
          <div className={s.qrDescription}>Only send Ether (ETH) to this address.</div>
          {renderQR(address)}
        </div>
      </div>
    )
  }
}

export default ReceiveEther
