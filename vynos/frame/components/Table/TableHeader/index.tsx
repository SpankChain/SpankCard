import * as React from 'react'
import * as PropTypes from 'prop-types'

export const TableHeader: React.SFC<any> = function(props) {
  const {
    children,
    className,
    ...rest
  } = props

  return (
    <thead
      {...rest}
      className={className}
    >
      {children}
    </thead>
  )
}

TableHeader.defaultProps = {
  children: [],
  className: '',
}

TableHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}
