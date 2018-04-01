import * as React from "react";
import {connect} from "react-redux";
import {FrameState} from "../../redux/FrameState";
import Password from './Password'
import Mnemonic from './Mnemonic'
import Deposit from './Deposit'

export interface InitPageProps {
  mnemonic: string|null
  showInitialDeposit: boolean
  isPerformer?: boolean
}

const InitPage: React.SFC<InitPageProps> = (props) => {
  if (props.isPerformer) {
    if (props.mnemonic) {
      return <Mnemonic />
    }

    return <Password />
  } else {
    if (props.showInitialDeposit) {
      return <Deposit />
    }

    if (props.mnemonic) {
      return <Mnemonic />
    }

    return <Password />
  }
}

function mapStateToProps(state: FrameState): InitPageProps {
  return {
    mnemonic: state.temp.initPage.mnemonic,
    showInitialDeposit: state.temp.initPage.showInitialDeposit,
    isPerformer: state.shared.isPerformer,
  }
}

export default connect<InitPageProps, undefined, any>(mapStateToProps)(InitPage)
