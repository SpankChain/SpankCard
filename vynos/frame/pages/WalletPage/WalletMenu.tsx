import * as React from "react";
import { Menu, Dropdown, Button, Image } from 'semantic-ui-react'
import {connect} from "react-redux";
import WalletMenuItem from "./WalletMenuItem";
import {FrameState} from "../../redux/FrameState";

const style = require('../../styles/ynos.css')

const SIGN_IN_LOGO = require('../../styles/images/sign-in_logo.svg')

export interface WalletMenuState {
  isOpen: boolean
}

export interface WalletMenuStateProps {
  doLock: () => void
  rememberPath: (path: string) => void
  path: string
  currentName: string
}

export type WalletMenuProps = WalletMenuStateProps

export function nameByPath (path: string): string {
  switch (path) {
    case '/wallet/channels':
      return 'Channels'
    case '/wallet/preferences':
      return 'Preferences'
    case '/wallet/network':
      return 'Network'
    default:
      return 'Wallet'
  }
}

export class WalletMenu extends React.Component<WalletMenuProps, WalletMenuState> {

  constructor (props: WalletMenuProps) {
    super(props)
    this.state = {
      isOpen: false,
    }
  }

  handleLockButton () {
    this.props.doLock()
  }

  handleOpenDropdown () {
    this.setState({
      isOpen: true
    })
  }

  handleCloseDropdown () {
    this.setState({
      isOpen: false
    })
  }

  renderHamburgerIcon () {
    return <div className={`${style.hamburger} ${style.hamburgerSpin} ${this.isActiveClassName()}`}>
      <div className={style.hamburgerBox}>
        <div className={style.hamburgerInner} />
      </div>
    </div>
  }

  isActiveClassName () {
    return this.state.isOpen ? style.isActive : ''
  }

  dropdownText () {
    if (!this.state.isOpen) {
      return this.props.currentName
    }
  }

  renderLogo () {
    let className = style.menuLogo
    if (this.state.isOpen) {
      className = className + ' ' + style.isActive
    }
    return <Image src={SIGN_IN_LOGO}
                  size='mini'
                  centered
                  className={className} />
  }

  handleChangeItem (name: string, href: string) {
    this.props.rememberPath(href)
  }

  render() {
    return <div className={style.walletMenuContainer}>
      <Menu style={{margin: 0}} className={style.walletMenu}>
        <Menu.Menu className={style.menuIntoOneItemFluid}>
          <Button icon
                  className={style.btnLock}
                  style={{order: 2, zIndex: 10, background: 'transparent', width: '65px', margin: '0 0 0 -65px', padding: 0, height: '4rem'}}
                  onClick={this.handleLockButton.bind(this)}>
            <i className={style.vynosLock}/>
          </Button>
          {this.renderLogo()}
          <Dropdown text={this.dropdownText()}
                    icon={this.renderHamburgerIcon()}
                    id={style.menuItemFluid}
                    pointing
                    className='link'
                    onOpen={this.handleOpenDropdown.bind(this)}
                    onClose={this.handleCloseDropdown.bind(this)} >
            <Dropdown.Menu className={style.submenuFluid}>
              <WalletMenuItem name='Wallet' href='/wallet/dashboard' onChange={this.handleChangeItem.bind(this)} />
              <Dropdown.Divider />
              <WalletMenuItem name='Channels' href='/wallet/channels' onChange={this.handleChangeItem.bind(this)} />
              <Dropdown.Divider />
              <WalletMenuItem name='Preferences' href='/wallet/preferences' onChange={this.handleChangeItem.bind(this)} />
              <Dropdown.Divider />
              <WalletMenuItem name='Network' href='/wallet/network' onChange={this.handleChangeItem.bind(this)} />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
      {this.props.children}
    </div>
  }
}

function mapStateToProps(state: FrameState): WalletMenuStateProps {
  return {
    doLock: () => {
      state.temp.workerProxy.doLock()
    },
    rememberPath: (path: string) => {
      state.temp.workerProxy.rememberPage(path)
    },
    path: state.shared.rememberPath,
    currentName: nameByPath(state.shared.rememberPath)
  }
}

export default connect(mapStateToProps)(WalletMenu)
