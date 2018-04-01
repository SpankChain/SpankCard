import * as React from 'react'
import * as PropTypes from 'prop-types'

export const TableCell: React.SFC<any> = function(props) {
  const {
    as,
    children,
    className,
    ...rest
  } = props

  return (
    <td
      {...rest}
      className={className}
    >
      {children}
    </td>
  )
}

TableCell.defaultProps = {
  children: [],
  className: '',
}

TableCell.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}
