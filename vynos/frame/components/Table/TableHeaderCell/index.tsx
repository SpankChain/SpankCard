import * as React from 'react';
import * as PropTypes from 'prop-types'
import * as classnames from 'classnames'

export const TableHeaderCell: React.SFC<any> = function(props) {
  const {
    as,
    className,
    sorted,
    ...rest
  } = props

  return (
    <td
      {...rest}
      as={as}
      className={className}
    />
  )
}

TableHeaderCell.defaultProps = {
  className: '',
  sorted: '',
}

TableHeaderCell.propTypes = {
  className: PropTypes.string,
}
