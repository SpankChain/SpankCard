import * as React from 'react'
import {ChangeEvent, MouseEvent} from 'react'
import {Dispatch} from 'redux'
import {FrameState} from '../../redux/FrameState'
import WorkerProxy from '../../WorkerProxy'
import {connect} from 'react-redux'
import * as actions from '../../redux/actions'
import {MINIMUM_PASSWORD_LENGTH, PASSWORD_CONFIRMATION_HINT_TEXT, PASSWORD_HINT_TEXT} from '../../constants'
import RestorePage from '../RestorePage'
import Button from '../../components/Button/index'
import TextBox from '../../components/TextBox/index'
import Input from '../../components/Input/index'
import OnboardingContainer from './OnboardingContainer'
import Submittable from '../../components/Submittable'

const style = require('../../styles/ynos.css')

export interface PasswordState {
  password: string
  passwordConfirmation: string
  passwordError: null | string
  passwordConfirmationError: null | string
  displayRestore: boolean
}

export interface PasswordSubpageStateProps {
  workerProxy: WorkerProxy
  isPerformer?: boolean
}

export interface PasswordSubpageDispatchProps {
  genKeyring: (workerProxy: WorkerProxy, password: string) => void
}

export type PasswordSubpageProps = PasswordSubpageStateProps & PasswordSubpageDispatchProps

export class Password extends React.Component<PasswordSubpageProps, PasswordState> {
  constructor (props: PasswordSubpageProps) {
    super(props)
    this.state = {
      password: '',
      passwordConfirmation: '',
      passwordError: null,
      passwordConfirmationError: null,
      displayRestore: false
    }
    this.handleChangePassword = this.handleChangePassword.bind(this)
    this.handleChangePasswordConfirmation = this.handleChangePasswordConfirmation.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  isValid () {
    let passwordError = this.state.passwordError
    if (this.state.password.length < MINIMUM_PASSWORD_LENGTH) {
      passwordError = PASSWORD_HINT_TEXT
      this.setState({
        passwordError: passwordError
      })
    }
    let passwordConfirmationError = this.state.passwordConfirmationError
    if (this.state.passwordConfirmation !== this.state.password && this.state.password) {
      passwordConfirmationError = PASSWORD_CONFIRMATION_HINT_TEXT
      this.setState({
        passwordConfirmationError: passwordConfirmationError
      })
    }
    return !(passwordError || passwordConfirmationError)
  }

  handleSubmit (e: MouseEvent<HTMLFormElement>) {
    if (this.isValid() && this.state.password) {
      return this.props.genKeyring(this.props.workerProxy, this.state.password)
    }
  }

  handleChangePassword (ev: ChangeEvent<EventTarget>) {
    let value = (ev.target as HTMLInputElement).value
    this.setState({
      password: value,
      passwordError: null,
      passwordConfirmationError: null
    })
  }

  handleChangePasswordConfirmation (ev: ChangeEvent<EventTarget>) {
    let value = (ev.target as HTMLInputElement).value
    this.setState({
      passwordConfirmation: value,
      passwordError: null,
      passwordConfirmationError: null
    })
  }

  doneDisplayRestorePage () {
    this.setState({
      displayRestore: false
    })
  }

  getText() {
    return this.props.isPerformer
      ? 'This is how you’ll get paid, payouts as often as you like, no chargebacks. SpankCard is a very safe and secure payment method based on crypto currencies.'
      : 'Your SpankWallet allows you to tip without any delay and to save you crypto fees by bundling payments.'
  }

  render () {
    const { isPerformer } = this.props

    if (this.state.displayRestore)
      return <RestorePage goBack={this.doneDisplayRestorePage.bind(this)} />

    return (
      <OnboardingContainer
        headerText={isPerformer ? 'Become a Model' : ''}
        totalSteps={isPerformer ? 3 : 4}
        currentStep={0}
      >
        <div className={style.content}>
          <div className={style.funnelTitle}>Create SpankCard</div>
          <TextBox className={style.passwordTextBox}>
            {this.getText()}
          </TextBox>
          <Submittable onSubmit={this.handleSubmit} className={style.submittable}>
            <Input
              placeholder="New Password"
              type="password"
              className={style.passwordInput}
              onChange={this.handleChangePassword}
              errorMessage={this.state.passwordError}
              inverse
            />
            <Input
              placeholder="Confirm Password"
              type="password"
              className={style.passwordInput}
              onChange={this.handleChangePasswordConfirmation}
              errorMessage={this.state.passwordConfirmationError}
              inverse
            />
            <div className={style.funnelFooter}>
              <Button
                type="secondary"
                content="Restore SpankWallet"
                onClick={() => this.setState({ displayRestore: true })}
                isInverse
              />
              <Button
                content="Next"
                onClick={this.handleSubmit}
                isInverse
                isSubmit
              />
            </div>
          </Submittable>
        </div>
      </OnboardingContainer>
    )
  }
}

function mapStateToProps (state: FrameState): PasswordSubpageStateProps {
  return {
    workerProxy: state.temp.workerProxy,
    isPerformer: state.shared.isPerformer,
  }
}

function mapDispatchToProps (dispatch: Dispatch<FrameState>): PasswordSubpageDispatchProps {
  return {
    genKeyring: (workerProxy, password) => {
      workerProxy.genKeyring(password).then(mnemonic => {
        dispatch(actions.didReceiveMnemonic(mnemonic))
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Password)
