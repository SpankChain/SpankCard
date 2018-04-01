import * as React from 'react'
import {Route, Switch, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {FrameState} from '../redux/FrameState'
import InitPage from './InitPage'
import UnlockPage from './UnlockPage'
import WalletPage from './WalletPage'
import {RouteComponentProps} from 'react-router'
import WorkerProxy from '../WorkerProxy'

export interface StateProps {
  isWalletExpected: boolean
  isUnlockExpected: boolean
  isTransactionPending: boolean
  isFrameDisplayed: boolean
  forceRedirect?: string
  workerProxy: WorkerProxy
}

export interface RootStateProps extends RouteComponentProps<any>, StateProps {
}

export type RootContainerProps = RootStateProps

export class RootContainer extends React.Component<RootContainerProps, any> {
  constructor(props: RootContainerProps) {
    super(props)

    this.lock = this.lock.bind(this)
  }

  componentDidMount () {
    this.determineRoute()
    window.addEventListener('keydown', this.lock)
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this.lock)
  }

  lock (e: KeyboardEvent) {
    if (e.ctrlKey && e.which === 76) {
      this.props.workerProxy.doLock()
    }
  }

  componentWillReceiveProps (nextProps: RootStateProps) {
    if (this.props.isUnlockExpected === nextProps.isUnlockExpected &&
      this.props.isWalletExpected === nextProps.isWalletExpected &&
      this.props.isTransactionPending === nextProps.isTransactionPending &&
      this.props.isFrameDisplayed === nextProps.isFrameDisplayed &&
      this.props.forceRedirect === nextProps.forceRedirect) {
      return
    }

    this.determineRoute(nextProps)
  }

  determineRoute (props?: RootStateProps) {
    props = props || this.props

    if (props.isUnlockExpected) {
      this.props.history.push('/unlock')
      return
    }

    if (!props.isWalletExpected) {
      this.props.history.push('/init')
      return
    }

    if (props.isWalletExpected) {
      if (props.forceRedirect) {
        this.props.history.push(props.forceRedirect)
        return
      }
      this.props.history.push('/wallet')
      return
    }

    if (!props.isFrameDisplayed) {
      this.props.history.push('/wallet')
      return
    }

  }

  render () {
    return (
      <Switch>
        <Switch>
          <Route path="/(wallet|card)" component={WalletPage} />
          <Route exact path="/unlock" render={() => <UnlockPage next="/wallet" />} />
          <Route path="/init" component={InitPage} />
        </Switch>

        <Route path="/" render={() => null} />
      </Switch>
    )
  }
}

function mapStateToProps (state: FrameState): StateProps {
  let workerProxy = state.temp.workerProxy
  return {
    workerProxy,
    isFrameDisplayed: state.shared.isFrameDisplayed,
    forceRedirect: state.shared.forceRedirect,
    isUnlockExpected: state.shared.didInit && state.shared.isLocked,
    isWalletExpected: state.shared.didInit && !state.shared.isLocked && !state.temp.initPage.showInitialDeposit,
    isTransactionPending: state.shared.didInit && state.shared.isTransactionPending !== 0
  }
}

export default withRouter(
  connect<StateProps, any, any>(mapStateToProps)(RootContainer)
)
