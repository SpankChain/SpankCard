import * as React from 'react'
import * as PropTypes from 'prop-types'

export const TableBody: React.SFC<any> = function(props) {
  const {
    children,
    className,
    ...rest
  } = props

  return (
    <tbody
      {...rest}
      className={className}
    >
      {children}
    </tbody>
  )
}

TableBody.defaultProps = {
  children: [],
  className: '',
}

TableBody.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}
