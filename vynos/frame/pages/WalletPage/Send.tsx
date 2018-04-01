import * as React from 'react'
import {connect} from 'react-redux'
import Web3 = require('web3')
import {Menu, Button, Container, Form, Divider} from 'semantic-ui-react'
import WalletAccount from "../../components/WalletPage/WalletAccount"
import {ChangeEvent, FormEvent} from "react";
import {FrameState} from '../../redux/FrameState'
import * as BigNumber from 'bignumber.js';

const style = require('../../styles/ynos.css')

export interface SendProps {
  web3?: Web3

  hideSend(): void
}

export interface SendState {
  step: number
  toError: string
  balanceError: string
  amountError: string
  step1Valid: boolean
  step2Valid: boolean
}

export class Send extends React.Component<SendProps, SendState> {
  address: string
  to: string
  amount: BigNumber.BigNumber
  fees: BigNumber.BigNumber
  balance: BigNumber.BigNumber

  constructor(props: any) {
    super(props);
    this.address = "";
    this.to = "";
    this.amount = new BigNumber.BigNumber(0);
    this.fees = new BigNumber.BigNumber(0);
    this.balance = new BigNumber.BigNumber(0);
    this.state = {step: 1, step1Valid: false, step2Valid: false, toError: "", amountError: "", balanceError: ""};
  }

  setTo(ev: ChangeEvent<EventTarget>) {
    let value = (ev.target as HTMLInputElement).value;
    this.to = value;
    this.checkValidStep1();
  }

  setAmount(ev: ChangeEvent<EventTarget>) {
    let value = (ev.target as HTMLInputElement).value;
    this.amount = new BigNumber.BigNumber(parseFloat(value));
    this.checkValidStep1()
  }

  checkValidStep1() {
    let web3 = this.props.web3!;
    let toError = "";
    let amountError = "";
    let valid = true;
    if (!this.to || !web3.isAddress(this.to)) {
      valid = false;
      toError = "Incorrect address";
    }
    if (!this.amount) {
      valid = false;
      amountError = "Incorrect amount"
    }
    this.setState({step1Valid: valid, toError: toError, amountError: amountError});
  }

  onChangeAddress(address: string) {
    this.address = address;
  }

  onChangeBalance(balance: BigNumber.BigNumber) {
    this.balance = balance;
  }

  menu() {
    return <Menu className={style.clearBorder} style={{margin: "-56px 0 0 0", zIndex: 10}}>
      <Menu.Item link className={style.menuIntoOneItemFluid}
                 onClick={this.props.hideSend.bind(this)}>
        <i className={style.vynosArrowBack}/> Send
      </Menu.Item>
    </Menu>
  }

  inputTo() {
    return <div>
      <input type="text" placeholder="To" onChange={this.setTo.bind(this)}
             className={this.state.toError ? style.inputError : ''}/>
      {this.state.toError ?
        <span className={style.errorText}><i className={style.vynosInfo}/> {this.state.toError}</span> : ''}
    </div>
  }

  inputAmount() {
    return <div className={"ui right labeled input"}>
      <input type="text" placeholder="Amount" onChange={this.setAmount.bind(this)}
             className={this.state.amountError ? style.inputError : ''}/>
      {this.state.amountError ?
        <span className={style.errorText}><i className={style.vynosInfo}/> {this.state.amountError}</span> : ''}
      <div className={"ui basic label"} style={{border: 0, fontWeight: 100, color: '#9F9F9F'}}>Ether</div>
    </div>
  }

  getWallet() {
    return <WalletAccount onChangeAddress={this.onChangeAddress.bind(this)}
                          onChangeBalance={this.onChangeBalance.bind(this)}/>
  }

  sendTransaction() {
    let web3 = this.props.web3!;
    let self = this;
    web3.eth.sendTransaction({
      from: this.address,
      to: this.to,
      value: web3.toWei(this.amount, 'ether')
    }, function (err, transactionHash) {
      if (err) {
        self.setState({step2Valid: false, balanceError: err.message});
      }else{
        console.log('Transaction hash :', transactionHash);
      }
    });
  }

  render() {
    if (this.state.step === 1)
      return <div>
        {this.menu()}
        <div>
          {this.getWallet()}
          <Container textAlign="center" style={{marginTop: '10px'}}>
            <Form className={style.encryptionForm} onSubmit={this.sendTransaction.bind(this)}>
              <Form.Field className={style.clearIndent}>
                {this.inputTo()}
              </Form.Field>
              <Form.Field className={style.clearIndent}>
                {this.inputAmount()}
              </Form.Field>
              <Divider hidden/>
              <Button type='submit' content="Send" primary className={style.buttonNav}
                      disabled={!this.state.step1Valid}/>
            </Form>
          </Container>
        </div>
      </div>
    return <div></div>
  }
}

function mapStateToProps(state: FrameState, ownProps: SendProps): SendProps {
  return {
    web3: state.temp.workerProxy.web3,
    hideSend: ownProps.hideSend
  }
}

export default connect(mapStateToProps)(Send)
