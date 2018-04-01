import * as React from 'react' // eslint-disable-line no-unused-vars
import * as classnames from 'classnames'
import {PropTypes} from 'react'

const s = require('./style.css')

export const BUTTON_TYPES = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary',
  DARK: 'dark'
}

export type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'dark'

export interface ButtonProps {
  type?: ButtonType
  className?: string
  isInverse?: boolean
  disabled?: boolean
  isMini?: boolean
  content: any
  onClick?: (e: any) => void
  to?: string,
  isSubmit?: boolean
}

class Button extends React.Component<ButtonProps> {
  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  };

  static defaultProps = {
    type: BUTTON_TYPES.PRIMARY,
    className: '',
  }

  render () {
    const {
      type,
      className,
      isInverse,
      disabled,
      isMini,
      content,
      isSubmit
    } = this.props

    const cn = classnames(s.btn, className, {
      [s.primary]: type === BUTTON_TYPES.PRIMARY,
      [s.secondary]: type === BUTTON_TYPES.SECONDARY,
      [s.tertiary]: type === BUTTON_TYPES.TERTIARY,
      [s.dark]: type === BUTTON_TYPES.DARK,
      [s.inverse]: isInverse,
      [s.mini]: isMini
    })

    return (
      <button
        className={cn}
        onClick={(e: any) => this.onClick(e)}
        disabled={disabled}
        type={isSubmit ? 'submit' : 'button'}
      >
        {typeof content === 'function' ? content() : content }
      </button>
    )
  }

  onClick (e: any) {
    if (this.props.to) {
      this.props.to.indexOf('http') === 0 ? window.open(this.props.to) :
        this.context.router.history.push(this.props.to)
    }

    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }
}

export default Button
