import * as React from 'react'
import { Menu, Button, Container, Form, Divider } from 'semantic-ui-react'
import TransactionMeta from '../../../lib/TransactionMeta'
import Web3 = require('web3')

const style = require('../../styles/ynos.css')

export interface ApproveTransactionProps {
  transaction: TransactionMeta
}

export interface ApproveTransactionState{
  to: string,
  formatedAmount: string
  formatedTotal: string
}

export default class ApprovePage extends React.Component<ApproveTransactionProps, ApproveTransactionState> {
  constructor(props: any) {
    super(props)
    if (!this.props.transaction.to) {
      return
    }
    let web3 = new Web3()
    let formatedAmount = web3.fromWei(this.props.transaction.amount, 'ether').toString()
    this.state = {
      to: this.props.transaction.to,
      formatedAmount,
      formatedTotal: formatedAmount
    }
  }

  render() {
    return <Form className={style.encryptionForm} >
      <Form.Field className={style.clearIndent}>
        <label>To:</label> <div className={style.listDesc}>{this.state.to}</div>
        <label>Amount:</label> <div>{this.state.formatedAmount}</div>
        <Divider />
        <label>Total:</label> <div>{this.state.formatedTotal}</div>
      </Form.Field>
      <Divider hidden />
    </Form>
  }
}

