import * as React from 'react'
import { Menu, Button, Container, Form, Divider } from 'semantic-ui-react'
import TransactionMeta from '../../../lib/TransactionMeta'
import Web3 = require('web3')

const style = require('../../styles/ynos.css')

export interface ApproveSignatureProps {
  transaction: TransactionMeta
}

export default class ApproveSingnature extends React.Component<ApproveSignatureProps> {
  constructor(props: ApproveSignatureProps) {
    super(props)
  }

  render() {
    return <Form className={style.encryptionForm} >
      <Form.Field className={style.clearIndent}>
        <div className={style.vynosInfo}>Signing this message can have dangerous side effects. 
        Only sign messages from sites you fully trust with your entire account.</div>
        <label>Address:</label> <div className={style.listDesc}>{this.props.transaction.from}</div>
        <label>Message:</label> <div className={style.listDesc}>{this.props.transaction.data}</div>
        </Form.Field>
      <Divider hidden />
    </Form>
  }
}

