import * as React from 'react'
import * as PropTypes from 'prop-types'
import * as classnames from 'classnames'

export const Table: React.SFC<any> = function(props) {
  const {
    children,
    className,
    ...rest
  } = props
  const classes = classnames(
    'table',
    className,
  )

  return (
    <table
      {...rest}
      className={classes}
    >
      {children}
    </table>
  )
}

Table.defaultProps = {
  children: [],
  className: '',
}

Table.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  sortable: PropTypes.bool,
}
